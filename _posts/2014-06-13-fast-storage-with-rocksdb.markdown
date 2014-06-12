---
layout: post
title: Fast Storage with RocksDB
excerpt: Using RocksDB for persistent fast key-value storage
permalink: /fast-storage-with-rocksdb/
date: 2014-06-13 00:00:00
authorslug: rohit_yadav
author: Rohit Yadav
---

In November last year, I started developing infrastructure that would allow us to
collect, store, search and retrieve high volume data. The idea was
to collect all the URLs on which the [homegrown CDN](https://visualwebsiteoptimizer.com/split-testing-blog/geo-distributed-architecture/)
would serve JS content. Based on our current traffic, we were looking to collect some 10k URLs per
second across four major geographic regions where we run our servers.

In the beginning we tried MySQL, Redis, Riak, CouchDB, MongoDB, ElasticSearch but
nothing worked out for us with that kind of high speed writes. We also wanted our
system to respond very quickly, under 40ms between
internal servers on private network. This post talks about how we were able to
make such a system using C++11, [RocksDB](http://rocksdb.org) and Thrift.

First, let me start by sharing the use cases of such a system in VWO; the
following screenshot shows a feature where users can enter a URL to check if VWO
Smart Code was found on it.

<div style="text-align:center; margin:5px">
<img src="/images/2014/06/0.png"><br>
<p>VWO Smart Code checker</p>
</div>

The following screenshot shows another feature where users can see a list of URLs
matching a complex wildcard pattern, regex pattern, string rule etc. while
creating a campaign.

<div style="text-align:center; margin:5px">
<img src="/images/2014/06/1.png"><br>
<p>VWO URL Matching Helper</p>
</div>

I [reviewed](http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis)
several opensource databases but none of them would fit our requirements except
Cassandra. In clustered deployment, reads from Cassandra were too slow and slower
when data size would grow. After understanding how Cassandra worked under the
hood such as its log structured storage like LevelDB I started playing with opensource
embeddable databases that would use similar approach such as LevelDB and KyotoCabinet.
At the time, I found an embedabble persistent key-value store
library built on LevelDB called [RocksDB](http://rocksdb.org).
It was opensourced by Facebook and had a fairly active developer community so I
started [playing](https://github.com/facebook/rocksdb/tree/master/examples)
with it. I read the [project wiki](https://github.com/facebook/rocksdb/wiki),
wrote some working code and joined their Facebook group to ask questions around
prefix lookup. The community was helpful, especially Igor and
Siying who gave me [enough hints](https://www.facebook.com/groups/rocksdb.dev/permalink/506160312815821/)
around prefix lookup, using custom extractors and bloom filters which helped me
write something that actually worked in our production environment for the first time.

<div style="text-align:center; margin:5px">
<img src="/images/2014/06/2.png"><br>
<p>RocksDB FB Group</p>
</div>

For capturing the URLs with peak velocity of 10k serves/s, I reused our
[queue based infrastructure](/scaling-with-queues/)
For storage, search and retrieval I wrote a custom datastore using C++, RocksDB
and Thrift, called _HarvestDB_. Most of our backend stack consists of PHP and
Python, so Thrift was useful for making this services distributed yet accessible
by various parts of the sub-system using Thrift based client libraries.
_HarvestDB_ implements four methods accessible
to Thrift clients - ping, get, put, search and purge. Clients use `ping` to check
_HarvestDB_ server connectivity before executing other procedures. RabbitMQ
consumers consume collected URLs and `put` them to _HarvestDB_. The PHP based
application backend uses custom Thrift based client library to `get` (read) and to `search` URLs.
A Python program runs as a periodic cron job and uses `purge` procedure to purge old entries
based on timestamp which makes sure we won't exhaust our storage
resources. The system is in production for more than five months now and is
capable of handling up to a tested workload of up to 24k writes/second while consuming
less than 500M RAM. The following diagram illustrates this architecture.

<div style="text-align:center; margin:5px">
<img src="/images/2014/06/3.png"><br>
<p>Overall architecture</p>
</div>
