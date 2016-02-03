---
layout: post
title: SuperElasticsearch - More Python goodness in elasticsearch-py
excerpt: We have been using Elasticsearch for storing analytics data. This data
         stored in elasticsearch is used in the Post Report Segmentation
         feature in VWO. So the amount of data getting stored in Elasticsearch
         is tied up to the number of campaigns currently being run by our
         customers. And often we need to have custom tooling to work with this
         data and the requirements of such tooling are also not common. This
         blog post is about how we solved some issues by building some missing
         blocks in the Official Elasticsearch Python client while working on
         this project.
authorslug: vaidik_kapoor
author: Vaidik Kapoor
---

We have been using [Elasticsearch][es] for [storing analytics data][old_post].
This data stored in Elasticsearch is used in the Post Report Segmentation
feature in VWO. So the amount of data getting stored in Elasticsearch is tied
up to the number of campaigns currently being run by our customers. And often
we need to have custom tooling to work with this data and the requirements of
such tooling are also not common. This blog post is about how we solved some
issues by building some missing blocks in the
[Official Elasticsearch Python][es_py] client while working on this project.

The code base where implementation of this feature (Post Report Segmentation)
lies is all written in Python. When we were starting out, we had to decide
which client to use because there were many out there. Eliminating some was
really easy because they were tied to certain frameworks like [Tornado][tornado]
and [Twisted][twisted]. And we were not sure which path to take initially so we
decided to keep things simple, avoid early optimization and not use any of
these framework heavily dependent on Non-Blocking IO. If we needed any of that
later, Gevent could be put to use (in fact that’s exactly what we did). Even
for the simpler way there were quite a few options. The deciding factors for
us were:

1. Maintenance commitment from the author
2. Un-opinionated
3. Simple design

Considering all these factors, we decided to go with the Official Python
Client for Elasticsearch. And we didn't really come across any issues and
problems according to our simple requirements. It is fairly extensible and
comes with some standard batteries included with it. For everything else, you
can extend it - thanks to its simple design.

It worked well for a while until we had to add some internal tooling where we
needed to work a lot with Elasticsearch's [Scroll API][scroll_api] and
[Bulk APIs][bulk_api].

## Bulk API

Elasticsearch's Bulk API lets you club together multiple individual API calls
into one. This is used a lot in speeding up indexing and can be very useful if
you are doing a lot of write operations in Elasticsearch.

The way you work with Bulk APIs is that you
construct a different kind of request body for bulk requests and use the client
for sending that request data. The HTTP API that Elasticsearch exposes for bulk
operations is semantically different than the API for individual operations.

Consider this. If you were to index a new document, update an existing document
and delete another existing document in Elasticsearch, you can do it like so:

{% highlight python %}
from elasticsearch import Elasticsearch

client = Elasticsearch(hosts=['localhost:9200'])
client.index(index='test_index_1', doc_type='test_doc_type',
             body=dict(key1='val1'))
client.update(index='test_index_3', doc_type='test_doc_type',
              id=456, body={
                  'script': 'ctx._source.count += count',
                  'params': {
                      'count': 1
                  }
              })
client.delete(index='test_index_2', doc_type='test_doc_type',
              id=123)
{% endhighlight %}

If you were to achieve the same thing using Bulk APIs, you would end up writing
code like this:

{% highlight python %}
from elasticsearch import Elasticsearch

client = Elasticsearch(hosts=['localhost:9200'])

bulk_body = ''

# index operation body
bulk_body += '{ "index" : { "_index" : "test_index_1", "_type" : "test_doc_type", "_id" : "1" } }\n'
bulk_body += '{ "key1": "val1" }\n'

# update operation body
bulk_body += '{ "update" : {"_id" : "456", "_index" : "test_index_3", "_type" : "test_doc_type"} }\n'
bulk_body += '{ "script": "ctx._source.count += count", "params": { "count": 1 } }\n'

# delete operation body
bulk_body += '{ "delete" : { "_index" : "test_index_2", "_type" : "test_doc_type", "_id" : "123" } }'

# finally, make the request
client.bulk(body=bulk_body)
{% endhighlight %}

There is a ton of difference in how bulk operations work on the code and API
level as compared to individual operations.

1. The request body is considerably different in Bulk APIs as compared to their
   individual APIs.
2. The responsibility of properly serializing request body is now shifted to
   the developer whereas this can be handled at the client level.
3. Serialization format itself is a mixup of JSON and new-line character
   separated string.

If you are depending a lot on bulk operations, these problems will bite you when
you start using it at a lot of places in your code. The flexibility of
manipulating bulk request bodies at will lacks with the current support for Bulk
APIs.

The official client as well does not really take care of this issue - not
blaming because the author's objective is to be as unopinionated as possible
and this also gave us the chance to do it our way instead of adopt an existing
implementation. We wanted to use Bulk API the same way we would use individual
APIs. And why shouldn't it be the same! They are essentially individual
operations put together and executed on a different end-point.

Our solution for this was to provide a BulkClient which would allow you to
start a bulk operation, execute bulk operations in a way that you would execute
individual operations and then when you want to execute them together, it will
make the required request body and use the Elasticsearch client to make the
request. Exposing bulk operations in a way that semantically look the same as
individual operations required us to implement APIs similar to individual APIs
on a very high level in the `BulkClient`.

This is how the `BulkClient` works:

{% highlight python %}
from elasticsearch import Elasticsearch

client = Elasticsearch(hosts=['localhost:9200'])

bulk = BulkClient(client)
bulk.index(index='test_index_1', doc_type='test_doc_type',
           body=dict(key1='val1'))
bulk.delete(index='test_index_2', doc_type='test_doc_type',
            id=123)
bulk.update(index='test_index_3', doc_type='test_doc_type',
            id=456, body={
                'script': 'ctx._source.count += count',
                'params': {
                    'count': 1
                }
            })
resp = bulk.execute()
{% endhighlight %}

## Scroll API

The next problem we faced was with Scroll API.

According to the documentation:

> While a search request returns a single "page" of results, the scroll API can
> be used to retrieve large numbers of results (or even all results) from a
> single search request, in much the same way as you would use a cursor on a
> traditional database.

Scroll API is helpful if you want to work with a large number of documents -
more like get them out of Elasticsearch.

The problem with Scroll API is that it requires you to do a lot of book
keeping. You have to keep `scroll_id` after every iteration to get the next set
of documents. Depending upon your application, there is probably no work
around. However, our use-case was to get a large number of documents all
together. You can do that without Scroll API as well i.e. by using the size
parameter where you can tell Elasticsearch how many documents to return and you
can ask it to return all documents by using the Count Search API first and then
passing the size, but that will usually time out (or at least it did for us).
So what we did was scroll Elasticsearch in a loop and do the book keeping in
the code. And that was simple as well until we had to do it at multiple places
- there was no uniform way to do that and a lot of code repetition was done as
well.

Our solution to this problem was to create a separate wrapper API only for this
purpose and use that everywhere in our project. So we wrote a simple function
that would do the book-keeping for us and it could be used like so:

{% highlight python %}
def scrolled_search(es, scroll, *args, **kwargs):
    '''
    Iterator for Elasticsearch Scroll API.

    :param es: Elasticsearch client object
    :param str scroll: scroll expiry time according to Elasticsearch Scroll API
                       docs

    ... Note:: this function accepts `*args` and ``**kwargs`` and passes them
               as they are to :meth:`Elasticsearch.search` method.
    '''

    ...

es = Elasticsearch(hosts=['localhost:9200'])
for docs in scrolled_search(es, '10m', index='tweets'):
    for doc in docs:
        print doc
{% endhighlight %}

### Iterator based Scrolling in elasticsearch-py

We must highlight that the official client also added support for iterator based
scrolling later in the official client as a ***helper***. We had already started
using our solution in our project and we find ours is slightly different than
theirs. For more details, [read the docs here][scansearch].

## SuperElasticsearch - elasticsearch-py with goodies!

Our solution to both the problems described earlier were based on the official
Elasticsearch client. After having solved these two problems, we figured that
instead of passing around the client object to our new API, it will be nicer if
we can use the new APIs in a way that it feels a part of the client itself. So
we went ahead and sub-classed the existing client class Elasticsearch to make
it easier to use the new APIs. You can use the sub-classed client
SuperElasticsearch like so:

{% highlight python %}
from superelasticsearch import SuperElasticsearch

client = SuperElasticsearch(hosts=['localhost:9200'])

# Example of using Scrolled Search
for doc in client.itersearch(index='test_index', doc_type'tweets',
                             scroll='10m'):
    # do something with doc here
    print doc


# Example of using Bulk Operations
bulk = client.bulk_operation()
bulk.index(index='test_index_1', doc_type='test_doc_type',
           body=dict(key1='val1'))
bulk.delete(index='test_index_2', doc_type='test_doc_type',
            id=123)
bulk.update(index='test_index_3', doc_type='test_doc_type',
            id=456, body={
                'script': 'ctx._source.count += count',
                'params': {
                    'count': 1
                }
            })
resp = bulk.execute()
{% endhighlight %}

This has also made it easy for us to do releases of SuperElasticsearch.
SuperElasticsearch does not depend on the official client in ways that it will
break compatibility with new releases of the official client, or if it will
then we can make the adjustments and come up with a new release. Basically it
has been written in a way to work with new versions of the official client with
minimum friction. If a new release of the official client comes out, then you
should be able to upgrade to the new Elasticsearch client without upgrading
SuperElasticsearch. This way we can try to keep developing SuperElasticsearch
at its own pace and release only when we have new features to release or when
it breaks compatibility. It also makes it easier for you to use the new APIs
because you get all of them with the client object itself.

SuperElasticsearch is available on [Github][superelasticsearch].

[tornado]: http://www.tornadoweb.org/en/stable/guide.html
[twisted]: https://twistedmatrix.com/trac/
[old_post]: http://engineering.wingify.com/posts/elasticsearch-for-analytics/
[bulk_api]: https://www.elastic.co/guide/en/elasticsearch/reference/1.4/docs-bulk.html
[scroll_api]: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-scroll.html
[es]: https://www.elastic.co/products/elasticsearch
[es_py]: https://github.com/elastic/elasticsearch-py
[superelasticsearch]: https://github.com/wingify/superelasticsearch
[scansearch]: https://elasticsearch-py.readthedocs.org/en/master/helpers.html#elasticsearch.helpers.scan
