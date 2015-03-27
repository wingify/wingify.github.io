---
layout: post
title: Elasticsearch for Analytics
excerpt: Elasticsearch is an open-source search engine. In this post, we will
         look at how we used Elasticsearch's indexing and querying capabilities
         to build analytics for VWO's (Visual Website Optimizer) A/B testing
         campaign reports.
authorslug: vaidik_kapoor
author: Vaidik Kapoor
---

[Elasticsearch][3] is essentially a distributed search-engine but there have
been more than one example of companies and projects using Elasticsearch for
analytics instead of search. We, at [Wingify][12], had similar requirements when we
decided to make our analytics more powerful to empower the customers of our
product, [Visual Website Optimizer (VWO)][13]. This blog post is about how we
used Elasticsearch to make [VWO's][13] user tracking a lot more powerful than it
earlier was.

## The Problem

For context, [VWO][13] is a tool that makes A/B testing of websites and mobile apps
so simple so that there is no engineering intervention involved to run new
A/B testing campaigns. Marketers and UI/UX designers do A/B testing to
improve online conversions and sales. [VWO][13] helps them with performing these A/B
tests with almost no engineering knowledge.

Since [VWO][13] is at the center of optimizing websites and mobile apps, this makes
user tracking important for our product - our users make use of the data we
collect to understand how their users (different segments of users) behave and
make optimization decisions accordingly. For example, in an A/B test campaign
with three variations, variation 2 might be winning for all the goals but for all
the users coming from India, variation 3 might be winning for all or some of the
goals. It should be possible for our customers to generate custom segmented
reports and observe these different behaviours. 

So lets summarize how a campaign and its reporting should work:

* A [VWO][13] customer may create multiple campaigns. These campaigns have more
  than one variations (variations are variants of web pages or iOS apps with UI
  changes) that our customer wants to A/B test against real-traffic.
* Every campaign has more than one goals (goals are events that you want to track,
  such as visiting a particular page, clicking a DOM element, submitting a
  form, triggering a custom event with JavaScript etc.) which our customer wants
  us to track.
* Our JavaScript library tracks how real visitors trigger goals (events) per
  variation and sends this data to our data collection end-points.
* Our data backend stores every visit and conversion for all the defined goals per
  variation. This is stored on a day-wise basis.
* When the campaign's report is accessed, the day-wise visitor and goal conversion data
  is used in the statistics that go behind generating the report.
* Reports are generated considering behaviour of all the users who became a part
  of the campaign. However, our customers should have the flexibility to segment
  reports on the basis of parameters like location, browser, operating system,
  time range, query parameters, traffic type, etc.

## In the prehistoric times

We used to store only counters in our database (we use MySQL) i.e. for goal per
variation, we used to store number of visitors and conversions. Here is some
sample data:

<pre>
+------------+---------------+-----------+---------+-----------------+------+-------------+
| account_id | experiment_id | variation | goal_id | event_date      | hits | conversions |
+------------+---------------+-----------+---------+-----------------+------+-------------+
|          1 |           198 | 2         |       1 | 2011-02-19      |   15 |          12 |
|          1 |           198 | 1         |       1 | 2011-02-19      |   10 |           2 |
|          1 |           198 | 2         |       1 | 2011-02-20      |    6 |           2 |
|          1 |           198 | 1         |       1 | 2011-02-20      |   13 |           8 |
|          1 |           198 | 1         |       2 | 2011-02-21      |    7 |           0 |
|          1 |           198 | 1         |       1 | 2011-02-21      |    7 |           7 |
|          1 |           198 | 2         |       2 | 2011-02-21      |    8 |           0 |
|          1 |           198 | 2         |       1 | 2011-02-21      |    8 |           8 |
|          1 |           198 | 2         |       2 | 2011-02-22      |    6 |           0 |
|          1 |           198 | 1         |       1 | 2011-02-22      |    8 |           8 |
+------------+---------------+-----------+---------+-----------------+------+-------------+
</pre>

We also support revenue tracking for a goal. There is a different table for
revenue tracking, which looks something like this:

<pre>
+------------+---------------+-----------+---------+-----------------+---------+
| account_id | experiment_id | variation | goal_id | event_date      | revenue |
+------------+---------------+-----------+---------+-----------------+---------+
|          1 |           198 | 2         |       1 | 2011-02-19      |   32.43 |
|          1 |           198 | 1         |       1 | 2011-02-19      |   34.35 |
|          1 |           198 | 1         |       1 | 2011-02-19      |    6.13 |
|          1 |           198 | 2         |       1 | 2011-02-19      |   21.93 |
|          1 |           198 | 2         |       1 | 2011-02-20      |   83.36 |
|          1 |           198 | 2         |       1 | 2011-02-20      |   72.65 |
|          1 |           198 | 1         |       1 | 2011-02-20      |   56.14 |
|          1 |           198 | 1         |       1 | 2011-02-20      |   87.12 |
|          1 |           198 | 1         |       1 | 2011-02-21      |   78.25 |
|          1 |           198 | 1         |       1 | 2011-02-21      |   88.36 |
+------------+---------------+-----------+---------+-----------------+---------+
</pre>

So when our customers want to view the report, our application's backend
will run some queries to generate aggregated metrics like total visitors per
goal per variation, total conversions per goal per variation, etc. which could
be taken care of using MySQL's built-in functions and then do some
statistics at the application level to decide winning variations per goal.

Notice that in our first table where we store hits (visitors) and conversions,
we store total counters of these two metrics per goal per variation per day. In
the revenue table, we store every individual revenue per goal per variation
with the exact date they occurred on. We need these separately as we need to
calculate sum of squares of every revenue generated which is used in the
statistics. I am not going to delve in the statistics side of things because
that is out of scope of this article.

This worked pretty well for us for a while. It was all very simple and we had
to deal with aggregated data most of the times other than the case of revenue
where in we had to get every row of revenue for a particular campaign. At the
application level, it was essentially firing up a few MySQL queries that would
give us the aggregated and day-wise data and then use that data to statistically
find winning variations per goal.

But this setup had a major drawback. Our customers were restricted to the view
of reports we would expose them to. It was not possible to drill down and
understand how different segments of users are behaving as the complete picture
may not say it all about some different segments. For example, in an A/B test
campaign with three variations, variation 2 might be winning for all the goals
but for all the users coming from India, variation 3 might be winning for all
or some of the goals. Finding this out was only possible by running another
campaign targeted to users from India on the basis of a hunch to understand if
the results would differ. And many times the results would not differ and our
customers will lose visitors from their visitor quota.

Furthermore, our data storage had a few other problems like no fine grain
control over date and time range (it was all day-wise), we would store all
the counters according to our customers' timezone (set at the time of account
creation) which means that changing timezone later would be possible but the
data collected earlier would be shown according to the previously selected
timezone. These were some major drawbacks to our way of storing visitor and
conversion data.

## New Age Reporting

We knew that our existing MySQL based setup was not perfect but more
importantly we realized that it does not help our customers. We wanted to make
things simpler for our customers so that:

* they could easily find important segments of users that behave
  differently and run targeted campaigns for them if necessary.
* they have finer control over date and time so that they can see reports
  at different steps like months, days, hours, minutes, etc.
* store everything in UTC so that we can take care of timezone changes at
  application level.

Looking at our application requirements, we realized that we cannot work with
just aggregated data any more. We needed to start storing individual visitor's
data and their corresponding conversions to achieve flexibility and giving the
power of slicing and dicing of the data in our customers' hands.

We are also a pretty small team, which means that we wanted lesser headaches
about ops and maintaining the entire system in production. We wanted things to
be simple and as self-managed as possible.

Our specific requirements were:

* Allow storage of individual visitor data with a lot of properties for
  performing segmentation.
* Allow filtering on all the stored fields for performing segmentation.
* Allow full text search on a few fields.
* Capable of storing events for lifetime of a customer account. This means that
  we cannot delete visitor data as long as our customer is with us.
* Getting consumable data out should be fast, or lets say not terribly slow. We
  are okay with an average of 2-3 seconds to start with.
* Easy ops:
  * Fault tolerant system. Failing nodes should not bring the service down.
  * Scalable to handle our growing traffic, storage and other requirements.

We knew that Hadoop is the de-facto system in the Big Data universe but the
entire Hadoop system is so vast that getting started with it is not as easy.
There tons of different tools in the Hadoop ecosystem and just selecting the
right tools for your use-case may take a significant amount of time for
research, leaving the implementation time aside. Also, running a Hadoop cluster
is no piece of cake. There are so many moving parts that you are not completely
aware of as soon as you start. And performing upgrades of systems that have more
systems running with it will always be problematic. Further, tuning all these
systems to give an acceptable performance also seemed like a daunting task for a
team as small as our's with no prior experience with such systems.

On top of the above problems that we got to know about Hadoop from our friends
working with it and from different blogs/websites, the task of implementing
the infrastructure requirements for Hadoop, building an implementation,
managing in production and then repeating the cycle for a team of 2 engineers
seemed like a daunting task.

We knew that life would be much easy if we keep things simple and we started
looking at other options.

## Elasticsearch to the rescue

Having worked with Elasticsearch before for a smaller project and remembering
that I had watched [Shay's talk][11] from Berlin Buzzwords where he mentioned
that Elasticsearch was also being used for analytics, we started looking at
Elasticsearch to solve our problems.

Elasticsearch supports filtering which we could use to filter visitors and
their conversions on the basis of a lot of properties that we wanted to
collect for every visitor. Filtering would be fast in Elasticsearch because you
can have indexes on every field if you want and since Elasticsearch
uses Lucene under-the-hood, we were confident about its indexing
capabilities. Elasticsearch supports full text search out-of-the-box.
This fits well with our basic application requirements. On top of this,
Elasticsearch supported Faceting (when we were evaluating, aggregations
frameworks was not there) which we could exploit for analytics. That means we
don't even have to get all the data out of Elasticsearch to our application
layer. Elasticsearch is capable of giving us an aggregated view of the data we
were storing.

This was just amazing for us. We were able to build a PoC within two weeks. The
next couple of months were spent on understanding Elasticsearch better,
optimizing our implementation, testing Elasticsearch against production load
and tuning it for the same.

In the meantime, Elasticsearch released 1.0.0 with aggregation framework and we
quickly moved from using [Facets][4] (see [Faceted Search][5]) to Aggregations.
[Aggregations][6] proved to be very useful with revenue goals as we could just
ask Elasticsearch to give us sum of squares of individual revenues without
getting individual revenues out of Elasticsearch.

As pointed out earlier, we need to track individual users. How we do this is
we create a document for a unique visitor per account per campaign in
Elasticsearch. This document stores user meta data, data for segmentation and
goal conversion tracking data. A typical visitor document looks like this:

{% highlight json %}
{
   "_index": "february-2015",
   "_type": "123",
   "_id": "D2E0A04858025DFE23928BC1F70D2156_123_313",
   "_score": 1,
   "_source": {
      "query_params": [
         {
            "val": "val1",
            "param": "param1"
         },
         {
            "val": "val2",
            "param": "param2"
         }
      ],
      "browser_string": "Chrome 40.0.2214",
      "ip": "8.8.8.0",
      "screen_colors": "24",
      "browser_version": "40.0.2214",
      "session": 1,
      "device_type": "Desktop",
      "document_encoding": "UTF-8",
      "variation_goals_facet_term": "c1_g1",
      "ts": 1424348107,
      "hour_of_day": 12,
      "os_version": "",
      "experiment": 313,
      "user_time": "2015-02-19T12:15:07.271000",
      "direct_traffic": false,
      "variation": "1",
      "ua": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36",
      "search_traffic": false,
      "social_referrer": "youtube",
      "returning_visitor": false,
      "hit_time": "2015-02-19T12:15:07",
      "user_language": "en-us",
      "device": "Other",
      "active_goals": [
         1
      ],
      "account": 196,
      "url": "https://vwo.com/lp/ab-testing-tool/?gclid=CPiZ7JT-7cMCFfDKtAodPUwAhQ",
      "country": "United Kingdom",
      "day_of_week": "Thursday",
      "converted_goals": [
         1
      ],
      "social_traffic": true,
      "converted_goals_info": [
         {
            "id": 1,
            "facet_term": "1_1",
            "conversion_time": "2015-02-19T12:15:54"
         }
      ],
      "referrer": "https://www.youtube.com/watch?v=EM-5IxL4HwQ",
      "browser": "Chrome",
      "os": "Windows 7",
      "email_traffic": false
   }
}
{% endhighlight %}

`_id` is the UUID of the visitor. Most of the other fields have
information extracted out from the IP address, the User Agent, the URL and the
Referring URL.

All the fields except a few are some fields with their types correctly set.
Indexes are maintained on all of them so that visitor documents can be filtered
according to the values in these fields.

But there are a few fields that are interesting:

* query_params
* converted_goals_info
* converted_goals_info.facet_term
* variation_goals_facet_term

Let's look at each of them one-by-one.

* **query_params** is an array of objects for storing query parameters and their
  respective values. This is of type `nested` because our customers may want to
  find all visitors and their conversions who visited pages with certain query
  parameters. Consider a scenario where you want to find all visitor documents
  with query parameter `param1` and `val2`. A simple `bool must` query with
  term query would return the above document if `query_params` was not nested
  because it would find one of the two `query_params.param` values to be equal
  to `param1` and the one of the two `query_params.val` values to be equal to
  `val2` but we know that `param1` never had `val2` as its value. This happens
  because each object in `query_params` array is not considered as an individual
  component of the document. `nested` types solve this problem. Read more about
  `nested` documents and relations in Elasticsearch in this [blog post][1].
* **converted_goals_info** is also an array of objects for storing information
  of individual goal conversions. Here we store `goal_id` of the converted goal,
  the time of conversion as a DateTime field and another field that we will
  shortly discuss. This field is also of `nested` type for the same reason as
  with `query_params`.
* **converted_goals_info.facet_term** and **variation_goals_facet_term** need to
  be discussed together because their values are constructed in a similar way.
  They in particular don't hold any new information. In the beginning of the
  post, we saw how we used to store aggregated visitor and conversion count per
  goal per variation per day. We still need that data out of Elasticsearch in a
  similar way for our statistics. The day-wise problem gets solved by using
  day-wise buckets in aggregations framework. The next problem is getting visitor
  counts per variation per goal. In MySQL terms, we would want to run a GROUP BY
  query on `variation` and `goal_id` column. In Elasticsearch, we can do
  something similar by using [Terms Aggregation using Scripts][2]. The problem
  with this approach is that if you have a large number of documents, your
  script will get evaluated on all of them and Elasticsearch is not really a
  script execution engine (no matter which scripting plugin you use). What you
  can do instead is push the result of a script at the time of indexing and then
  simply run Terms Aggregation on it. We saw massive performance boost by doing
  this performance hack.

Every document gets saved under the `doc_type` for the account that campaign
belongs to i.e. every account on [VWO][13] has a separate doc type.

### Performance

From performance point-of-view, Elasticsearch has very fast indexing and
querying capabilities. It is a distributed system - you can deploy a cluster
of nodes in production which stores indexes in a distributed fault-tolerant
way to give you performance benefits. Increase the number of replicas per shard
and you can scale reads and queries. This can be done after creating an index as
well. Elasticsearch does not allow changing of number of shards though. But
there is a sweet work around for that. Just create a new index with more shards
and use aliases, and you can now scale indexing as well.

#### Sharding

From our experience with working on large data sets which need to be queried on
an ad-hoc basis and have low latency requirements and from our learning from
[Shay's][10] talks ([1][7], [2][8], [3][9]), we understood that a data storage
system meant to store a lot
of data will scale for your reads and querying requirements well if you can
shard your data well according to the variable that determines the growth of
that data. For example, if you are using any database for storing machine logs,
you should be able to shard your data probably according to time because you
would want to query the most recent data and if you have to do it from the all
the data you ever collected, then your old data will only become a performance
bottleneck. So a possible sharding strategy could be sharding data according to
month-year.

Our requirement was similar. We get visitor data which we could easily shard
on monthly basis. And since this data would keep on growing, we can just add new
indexes every month and place the new data in these indexes. However, which
index a visitor document goes to is not determined by the timestamp of the
visitor but it is determined by the date of creation of the campaign. Why? Our
customers view campaign reports i.e. when a campaign report is opened, we want
to get data for that campaign only. So it would make sense to have all the data
for a campaign reside only in one index because we wouldn't want to look into
multiple indexes for generating report of one campaign. If we decided to put
visitor documents in different indexes depending upon time of visit, we would
have faced the following problems:

* A campaign may run for more than a month, so visitor documents for a campaign
  may be in more than one indexes and we would not have any way to know which
  all indexes without keeping a track of it separately as to which indexes have
  visitors for a given campaign. This would be painful.
* Since visitors also convert goals and we store conversion data in visitor
  documents, it would be very difficult for us to find which index to find the
  visitor document in so that we can add conversion tracking related data in the
  document.

These problems get solved when we restrict all visitor data for a given campaign
to go in one index only. So for `account_id` 123 that has two campaigns -
campaign 1 (created in January 2015) and campaign 2 (created in February 2015),
the visitor documents for both will be created in the indexes for January 2015
and February 2015 respectively.

Another big advantage of this is that we can adjust the number of shards every
month. So if we are seeing a trend of more visitors getting tracked month after
month, in the next month we can create a new index with more shards than the
previous month's index.

#### Routing

Since documents are stored in a particular shard in an index, Elasticsearch
needs to decide which shard to put the document in. Elasticsearch use a hashing
algorithm that is used for shard selection and Elasticsearch uses document's ID
by default for determining which shard that document goes into. This is called
routing a document into a shard. This may work fine in some cases. But the
drawback of this default routing strategy is felt when you have a large number
of shards and also when you have to serve a lot of queries. The drawback is that
Elasticsearch now needs to search every shard in an index for all the documents
matching a given query, wait for the results, aggregate them and then return the
final result. So for a given query, all shards get busy.

This can be controlled by using a better routing strategy. In our case, we
generate reports of a campaign of a given account. It would be ideal that one
account does not limit report generation of another account. So instead of going
with the default routing strategy, we decided to route documents on the basis of
`account_id`. So now, when a campaign report is generated for a given account,
the query hits only a single shard, leaving all other shards available for
serving other queries and also freeing up CPU resources. After moving to this
routing strategy, we saw a significant reduction in CPU usage in our cluster.

### Operations

From operations and management point-of-view, Elasticsearch is fault tolerant -
indexes can be sharded and replicated and distributed in a cluster.
Elasticsearch distributes shards and their replicas on different nodes in the
cluster so that if a node fails, Elasticsearch promotes replicas to be the
primary shards and moves shards and replicas in the cluster to balance the
cluster. What is really amazing is that Elasticsearch also gives control over
placement of shards in a cluster so that it is easy for you to separate hot
data from cold (historic) data easily. We have not had the need to use this
feature yet, but it is good to know that we can do this if at all historic data
becomes a performance problem. Chances are that it will become a problem but
probably much later.

## Drawbacks

Although Elasticsearch made it really easy for us to push out something like
this with so much ease (and remember we had no experience building something
like this before) and we love Elasticsearch for that, we did find a few things
with it that we think limits us.

* The facet term hack for avoiding running scripts works great but then it's also
  limiting if you want to add new features in your application that rely on
  different scripts that were not added at the time of indexing. This means that
  you will have to re-index all your data if you want to support this new
  feature or just provide this feature on new data.
* Lack of JOINS becomes limiting. As of now we push the conversion data in
  visitor document. But it would have been ideal if we could independently index
  conversions data in a separate index or doc type.

We don't know how to solve these problems yet or if Elasticsearch team has any
plans for bringing something new that fixes these problems. It will open
Elasticsearch to a lot more possibilities if JOINS were possible. But we also
understand that it's not a simple problem to solve and Lucene and Elasticsearch
were not made keeping these use-cases in mind. Nevertheless, we hope to see
these improving in the future, especially because a lot of companies are using
Elasticsearch for analytics as well.

## Conclusion

Elasticsearch has been great for us and it proves that you don't always need
Hadoop for building analytics depending upon your requirements. The amazing
thing is that we feel Elasticsearch is amazing when it comes to scaling when
limited by resources - horizontal scaling is extremely simple. But it will work
for you or not depends entirely on your requirements.

Elasticsearch already works with Hadoop, which is being further developed to
expand the use-cases it can support. This gives us a lot of confidence as we
will add more features to [VWO's][13] user tracking in the future and we know that we
will not be limited by our decision to use Elasticsearch.

[1]: https://www.elastic.co/blog/managing-relations-inside-elasticsearch/
[2]: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html#search-aggregations-bucket-terms-aggregation-script
[3]: https://www.elastic.co/products/elasticsearch
[4]: http://www.elastic.co/guide/en/elasticsearch/reference/current/search-facets.html
[5]: https://en.wikipedia.org/wiki/Faceted_search
[6]: http://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html
[7]: https://www.youtube.com/watch?v=SIj5eJw8BUE
[8]: https://www.youtube.com/watch?v=fEsmydn747c
[9]: https://vimeo.com/44716955
[10]: http://thedudeabides.com/
[11]: https://vimeo.com/44716955
[12]: https://wingify.com
[13]: https://vwo.com
