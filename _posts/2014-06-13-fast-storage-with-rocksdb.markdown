---
layout: post
title: Fast Storage with RocksDB
excerpt: Using RocksDB for persistent fast key-value storage
permalink: /fast-storage-with-rocksdb/
date: 2014-06-13 00:00:00
authorslug: rohit_yadav
author: Rohit Yadav
---

In November last year, I was asked to work on some infrastructure that would
collect, store, search and retrieve high volume data. The idea was
to collect all the URLs on which the [homegrown CDN](vwo.com/blog/geo-distributed-architecture/)
would serve JS content. Based on our current traffic, we were looking to collect some 10k URLs per
second across four major geographic regions where our servers are located.

In the beginning we tried MySQL, Redis, Riak, CouchDB, MongoDB, ElasticSearch but
nothing worked out for us with that kind of high velocity writes. We also wanted our
system to respond very quickly, with configurable soft limits of 40ms between
internal servers on private network. This post talks about how we were able to
achieve that using [RocksDB](http://rocksdb.org) and create a homegrown datastore system
called **HarvestDB**.

Before I talk about the technical side of things, let me show you how this
infrastructure is used in VWO. The following screenshot shows a feature where
users can enter URL to check whether VWO Smart Code was installed on it.

<div style="text-align:center; margin:5px">
<img src="/images/2014/06/0.png"><br>
<p>VWO Smart Code checker</p>
</div>

The following screenshot shows another feature where users can see list of matching
URLs matching a complex wildcard pattern, regex pattern, string rule etc. while
creating a campaign.

<div style="text-align:center; margin:5px">
<img src="/images/2014/06/1.png"><br>
<p>VWO URL Matching Helper</p>
</div>

We started by [reviewing](http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis)
several opensource databases but none of them would fit our requirements except
Cassandra. But, the issue with Cassandra was read latency in a clustered deployment
when data size grew. I read how Cassandra was implemented and found that their
approach is the best way to solve our problem.

Next I started playing with opensource embeddable databases such as LevelDB,
KyotoCabinet etc. Finally, I found about [RocksDB](http://rocksdb.org) which was
based off LevelDB and was recently opensourced by Facebook at the time. For
getting started with RocksDB I recommend you start with the examples that come
part of the repo [examples](https://github.com/facebook/rocksdb/tree/master/examples).

I read RockDB's [wiki articles](https://github.com/facebook/rocksdb/wiki), wrote
some proof of concept code, joined their Facebook group and started asking
questions around prefix lookup. The community was helpful especially Igor and
Siying who gave me [enough hints](https://www.facebook.com/groups/rocksdb.dev/permalink/506160312815821/)
around prefix lookup and using custom extractors and bloom filters.

<div style="text-align:center; margin:5px">
<img src="/images/2014/06/2.png"><br>
<p>RocksDB FB Group</p>
</div>


For capturing URLs at peak velocity of 10k serves/s, our [queue based infrastructure](/scaling-with-queues/)
was reused. This solved the problem of collection of high velocity data.

For storage, search and retrieval we built a custom datastore using C++, RocksDB
and Thrift, called **HarvestDB**. Most of our backend stack consists of PHP and
Python, so Thrift was useful for making this services distributed yet accessible
by various parts of the sub-system.


<div style="text-align:center; margin:5px">
<img src="/images/2014/06/3.png"><br>
<p>Overall architecture</p>
</div>
