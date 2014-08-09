---
layout: post
title: Wingify at The Fifth Elephant
excerpt: We sponsored The Fifth Elephant. This blog post is an account of what we did at the event and what we learned by sponsoring, attending and being present at the conference as an organization.
permalink: /wingify-at-the-fifth-elephant/
date: 2014-08-02 00:00:00
authorslug: vaidik_kapoor
author: Vaidik Kapoor
---


[The Fifth Elephant][1] is a popular conference in India around the Big Data ecosystem. It happened last week in Bangalore. And we were proud to sponsor the conference. To represent Wingify at the event, [Ankit][2], [Varun][3] and [I (Vaidik)][4] attended the event. This blog post is an account of what we did at the event and what we learned by sponsoring, attending and being present at the conference as an organization.

<script>Galleria.run('#fifth-elephant-gallery');</script>
<div id="fifth-elephant-gallery" style="height: 600px;">
    <img src="/images/2014/08/0.jpg">
    <img src="/images/2014/08/3.jpg">
    <img src="/images/2014/08/1.jpg">
    <img src="/images/2014/08/2.jpg">
    <img src="/images/2014/08/4.jpg">
    <img src="/images/2014/08/5.jpg">
    <img src="/images/2014/08/6.jpg">
    <img src="/images/2014/08/7.jpg">
    <img src="/images/2014/08/8.jpg">
</div>

## The conference

The organizers reported that there were 960 registrations for the conference - quite a big number for a conference around something like Big Data. It seems most of the attendees were from Bangalore and not many had come from Delhi. There were talks around infrastructure for big data systems, machine learning, data mining, etc. A few talks out of the ones we attended were really good. There were a few that we wanted to attend but couldn't because we were busy talking to people who wanted to talk to us and know more about us. Well that's what conferences are about - attend a few good talks and meet a lot of people. Fortunately, HasGeek will put out the [recorded videos][5] of those sessions soon. Some talks were around interesting topics and some not so much. Shailesh's talk on [The Art of Data Mining][6] was certainly the best talk out of all the talks that I managed to attend (personal opinion).

There were poster sessions for talks that the editorial panel found interesting but not interesting enough to select them for sessions. My proposal for [Using Elasticsearch for Analytics][7] ([presentation slides][8]) was selected for a poster session, which I presented on the 2nd day of the conference. It was interesting to see that multiple teams within Flipkart, Red Hat, a couple of other product startups and services companies were interested in doing the same. So we ended up having long discussions about how are using [Elasticsearch][9] for analytics it at Wingify and how they can use [Elasticsearch][10] to solve similar problems.

<div style="text-align:center; margin: 5px;">
  <a href="https://flic.kr/p/ovqdx8">
    <img src="/images/2014/08/7.jpg">
  </a>
</div>

## Our presence at the conference

We had a desk/booth which we managed to prepare nicely to catch everyone's attention. We got a display next to our desk on which we played our super cool video that we put on [vwo.com][11] (a few people expressed that they really liked the video). I think that caught a lot of people's attention. We also strategically placed our standees at places where it was clearly visible. Looking at other standees, I think ours was one of the best in design if not the best. We distributed our t-shirts and stickers, which seemed to attract a lot of people (more than once for the free t-shirt). A few people gave us compliments for the A-4 insert we distributed to all the participants at the time of registration. Thanks to Paras for helping out with the content and the design.

On the first day, an overwhelming number of people walked up to our booth. They were mostly unaware of our and our product's existence. Many were blown away by the idea. Some not so much. But after talking to so many people, we figured that we were not absolutely correct about ignoring this conference as a place to promote the product and get prospective clients. Other than engineers, there were decision makers from large companies like Amazon, Citibank, Ebay and Lenovo who Ankit got a chance to speak with.

We were primarily at Fifth Elephant for the purpose of establishing the Wingify engineering brand and hiring. We were able to spread the word about what we do and got people interested about product and work. So on the front of establishing our engineering brand, we were somewhat successful - this was evident from the kind of conversations we had with people at our booth and the number of people who shared their contact details with us (this is not always very conclusive as free goodies attract people and the number can be deceiving). A lot of people were interested in understanding what kind of roles we are hiring for. These people were interested in data science and software engineering. Fingers crossed - we might get some applications soon and opportunity to work with some amazing people. People found our product cool - many did not know that something of this sort existed. I think this was one of the things that got them interested. However, some were sad to know that we are based out of Delhi instead of Bangalore, as I initially said that it seemed like most of the attendees were from Bangalore. That just says that the community in Delhi needs to work together to make Delhi more exciting for engineers.

## Community

We engaged with the community through our booth and at other moments like lunch during the conference. We got the opportunity to make connections with different startups and individuals like Jabong, BloomReach, SupportBee, Inmobi, Flipkart, GlusterFS (and Red Hat), Qubole, Myntra, Aerospike and Slideshare. I might have missed some unintentionally. We got to learn about what they are doing and we shared what we are doing. Discussions were usually about the product, engineering, our tech stack, specific engineering problems, the team, work culture, community in Delhi, etc. People were exited to know our stack and what we are doing with it. We always knew that our tech stack is not the conventional stack but we realized that it's uncommon and cool.

In the process, we had good some good discussions and connected with good people who we think will hopefully help us with solving some problems we are trying to solve - making friends of Wingify :)

## We learned about new things

We have not always been very focussed at doing a lot with collected data. With our latest release, we have come up with a number of features that make use of large amount of data our systems collect and our solutions to these problems were rather unconventional. With the latest release and our plans, we will be making more and more use of collected data for deriving useful insights for our customers and building new features that will help our customers optimize and increase their conversions. Since we have plans to work with data, The Fifth Elephant was an important conference for us to learn about what exactly is going on in the Big Data universe and how we can make use of all that at Wingify. Aerospike NoSQL Database, Cachebox, Imobi's Grill project are just a few things that we got introduced to and we may explore them in the future for our varied use-cases. It was interesting to see people are trying to leverage SSDs for solving different kind of problems. Aerospike is a NoSQL database optimized for SSD disks and claims to be extremely performant (200,000 QPS per node). CacheBox is an advanced caching solution that leverages flash storage for improving performance for databases.

Other than these systems, there were some learning around building big data infrastructure, real-time data pipelines and data mining. There was a talk on [Lessons from Elasticsearch in Production][12] by [Swaroop CH][13] from [Helpshift][14]. We have been using Elasticsearch at Wingify and it was interesting to see that we were not facing similar problems as they were. We took that as a sign to be cautious and be prepared for firfighting such problems. These were around using Elasticsearch's Snapshot and Restore API (they say it doesn't work) and performing rolling upgrades (which is the recommended way of doing upgrades). We never had such problems but we are now aware that others have had such problems and we can be better prepared.

## To sum up

It was a great experience being at this conference. It was for the first time we attended a Big Data conference. This ecosystem in India seems to be big and growing and hopefully there will be better content at conferences like these in the future. Thanks to [HasGeek][15] for taking the initiative. We hope that the conference will continue to happen in the years to come.

If you were present at the conference and met us there, please do not hesitate to connect with us. If you have any questions to ask regarding our experiences, go ahead and leave comments and we will get back to you. If you like what we do at Wingify and want to join the force, we will be happy to work with you. [We are hiring!][16]

### Photo Credits

The beautiful photopgraphs in this post have been provided by [HasGeek][17]. You can find more photographs of The Fifth Elephant at the following links:

* [Conference Day 1][18]
* [Conference Day 2][19]


  [1]: http://fifthelephant.in
  [2]: http://twitter.com/ankneo
  [3]: http://github.com/softvar
  [4]: http://github.com/vaidik
  [5]: http://hasgeek.tv
  [6]: https://funnel.hasgeek.com/fifthel2014/1166-the-art-of-data-mining-practical-learnings-from-re
  [7]: https://funnel.hasgeek.com/fifthel2014/1143-using-elasticsearch-for-analytics
  [8]: https://speakerdeck.com/vaidik/using-elasticsearch-for-analytics
  [9]: http://elasticsearch.org
  [10]: http://elasticsearch.org
  [11]: https://vwo.com
  [12]: https://funnel.hasgeek.com/fifthel2014/1181-lessons-from-elasticsearch-in-production
  [13]: https://twitter.com/swaroopch
  [14]: http://helpshift.com
  [15]: http://hasgeek.in
  [16]: http://wingify.com/careers
  [17]: http://hasgeek.in
  [18]: https://www.flickr.com/photos/hasgeek/sets/72157645996766474/
  [19]: https://www.flickr.com/photos/hasgeek/sets/72157645599451387/
