---
layout: post
title: Scaling with Queues
excerpt: Scaling with Queues
permalink: /scaling-with-queues/
date: 2013-09-02 00:00:00
authorslug: rohit_yadav
author: Rohit Yadav
---

Our home grown [geo-distributed architecture](http://visualwebsiteoptimizer.com/split-testing-blog/geo-distributed-architecture/)
based CDN allows us to delivery dynamic javascript content with minimum
latencies possible. Using the same architecture we do data acquisition as well.
Over the years we've done a lot of changes to our backend, this post talks
about some scaling and reliability aspects and our recent work on making fast and
reliable data acqusition system using message queues which is in production for
about three months now. I'll start by giving some background on our previous
architecture.

[Web beacons](http://en.wikipedia.org/wiki/Web_bug) are widely used to do data
acquisition, the idea is to have a webpage send us data by means of a HTTP request
and the server sends some valid object. There are many ways to do this. To keep
the size of the returned object small, for every HTTP request we
return a tiny 1x1 pixel gif image and our geo-distributed architecture along with
our managed Anycast DNS service helps us to do this with very low latencies,
we aim for less than 40ms. When a HTTP request hits one of our data acquisition servers, [Openresty](http://openresty.org)
handles it and our Lua based code processes the request in the same process thread.
Openresty is a `nginx` mod which among many things bundles `luajit` that allows
us to write URL handlers in Lua and the code runs within the web server. Our Lua code
does some quick checks, transformations and writes the data to a [Redis](http://redis.io)
server which is used as fast in-memory data sink. The data stored in Redis is
subsequently moved, processed and stored in our database servers.

<div style="text-align:center; margin:5px">
<img src="/images/2013/09/0.png"><br>
<p>Previous Architecture</p>
</div>

This was the architecture when I had [joined](http://team.wingify.com/friday-engineering-talks-at-wingify)
Wingify couple of months ago. Things were going smooth but the problem was we were
not quite sure about data accuracy and scalability. Redis was used as a fast
in-memory data storage sink, which our custom written PHP based queue infrastructure
would read from, our backend would process it and write to our database servers.
The PHP code was not scalable and after about a week of hacking, exploring options
we found few bottlenecks and decided to re-do the backend queue infrastructure.

We explored many [options](http://queues.io) and decided to use [RabbitMQ](http://www.rabbitmq.com).
We wrote quite a few proof-of-concept backend programs in Go, Python and PHP and
did a lot of testing, benchmarking and real-world [load testing](http://loader.io).

Ankit, Sparsh and I discussed how we should move forward and we finally
decided to explore two models in which we would replace the home grown PHP queue
system with RabbitMQ. In the first model, we wrote directly to RabbitMQ from the
Lua code. In the second model, we wrote a transport agent which moved data from Redis
to RabbitMQ. And we wrote RabbitMQ consumers in both cases.

There was no Lua-resty library for RabbitMQ, so I wrote one using `cosocket` APIs
which could publish messages to a RabbitMQ broker over STOMP protocol. The library
[lua-resty-rabbitmqstomp](https://github.com/wingify/lua-resty-rabbitmqstomp) was
opensourced for the hacker [community](https://groups.google.com/forum/?fromgroups#!forum/openresty-en).

Later, after I rewrote the Lua code using this library and ran a [loader.io](http://loader.io)
load test. It failed this model due to very low throughtput. For us, the STOMP protocol
and slow RabbitMQ STOMP adapter were performance bottlenecks. RabbitMQ was not
as fast as Redis, so we decided to keep it and work on the second
model. For our requirements, we wrote a proof-of-concept Redis to RabbitMQ transport
agent called `agentredrabbit` to leverage Redis as a fast in-memory storage sink and
use RabbitMQ as a reliable broker. The _POC_ worked well in terms of performance,
throughput, scalability and failover. In next few weeks we were able to write a
production level queue based pipeline for our data acquisition system.

For about a month, we ran the new pipeline in production against the existing one,
to A/B test our backend :) To do that we modified our Lua code to write to two
different Redis lists, one was consumed by the existing pipeline, the other was
consumed by the new RabbitMQ based pipeline. The consumer would process and write
data to a new database. This allowed us to compare realtime data from the two
pipelines. During this period we tweaked our implementation a lot, rewrote the
producers and consumers thrice and had two major phases of refactoring.

<div style="text-align:center; margin:5px">
<img src="/images/2013/09/1.png"><br>
<p>A/B testing of existing and new architecture</p>
</div>

Based on results, we migrated to the new pipeline based on RabbitMQ. There were
other issues of HA, redundancy and failover that were addressed in this migration.
The new architecture ensures no single point of failure and has mechanisms to
recover from failure and fault.

<div style="text-align:center; margin:5px">
<img src="/images/2013/09/2.png"><br>
<p>Queue (RabbitMQ) based architecture in production</p>
</div>

We've [opensourced `agentredrabbit`](https://github.com/wingify/agentredrabbit)
which can be used as a general purpose fast and reliable transport agent for
moving data in chunks from Redis lists to RabbitMQ with some assumptions and queue
name conventions. The flow diagram below has hints on how it works, checkout the
[README for details](https://github.com/wingify/agentredrabbit).

<div style="text-align:center; margin:5px">
<img src="/images/2013/09/3.png"><br>
<p>Flow diagram of "agentredrabbit"</p>
</div>
