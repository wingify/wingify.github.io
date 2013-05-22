---
layout: post
title: "Introduction: Engineering @ Wingify"
excerpt: Introduction to Engineering @ Wingify
permalink: /introduction/
date: 2013-05-14 01:12:02
authorslug: sparsh_gupta
author: Sparsh Gupta
---

I clearly remember the summer of 2010 when we were about to launch our
product [Visual Website Optimizer](http://visualwebsiteoptimizer.com) out
of beta and almost all the conversations I and [Paras](
http://twitter.com/paraschopra) had were either around acquiring our
initial customers or about the ever increasing load on our single [Linode](
http://linode.com) 512MB VPS. Three years down, we still end up
discussing about the same things but at a completely different magnitude.
The customer base has increased to 2600+ accounts across 75+ countries and
our globally distributed architecture on a set of 30+ servers currently
serve close to 7,500 requests per second.

In this amazing journey what we also managed to do is try our hands on a
bunch of different technologies, tools and libraries. Many a times, the
available stuff didn't fit our scaling needs and we had to craft our own
version. With the medium of this blog (which was unfortunately long due),
my awesome engineering team will try to talk about all the learning we keep
having in our day-to-day engineering work at [Wingify](http://wingify.com).

In the next few posts, we will be walking though the changes in our
architecture (from standard LAMP to a delicately configured [openresty](
http://openresty.org) CDN & DA (Content distribution & data acquisition
network) environment; from a single data center stack to a distributed
system across the globe), code rewrites / refactors we had to do, various
benchmarks we relied on and of course all the learning we had from this
exercise. We will cover the reasons that motivated us to rewrite our JS
based editor and why we decided to abandon the project. We will showcase
and write about the small / big tools and libraries we wrote to scratch our
own itch.

If you ever have any question, suggestion, feedback or you want to discuss
anything or just drop a hello; we would love to hear from you. Please feel
free to get in touch with me [sparsh@wingify.com](mailto:sparsh@wingify.com)
or our engineering team [engineering@wingify.com](mailto:
engineering@wingify.com) directly or via comments section in this blog.

See you soon with our first real post :)

-- Engineering @ [Wingify](http://wingify.com)
