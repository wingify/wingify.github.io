---
layout: post
title: A lua-nginx Client for Pub/Sub
excerpt: A lua-nginx Client for Pub/Sub
authorslug: vasu_gupta
author: Vasu Gupta
---

## Introduction
Lua as a part of the OpenResty package, is extensively used in our in-house [Dynamic CDN (DACDN)](https://engineering.wingify.com/posts/dynamic-cdn/) module. CDN generally is used for quick content delivery but our in-house CDN works both as content delivery as well as a data acquisition service for gathering copious amounts of data of our client's visitors. Since the collection of data at a high throughput requires a sophisticated queue mechanism, therefore, one of the core parts of our DACDN is to publish packets to [Google Cloud Pub/Sub](https://cloud.google.com/pubsub/docs/overview). 

Pub/Sub lets any number of publishers publish data, ideally to a topic, which could be subscribed to by any number of subscribers. This messaging queue was an ideal choice for us since it can accept publish throughput up to 200 MB/s and subscriber throughput up to 400 MB/s. It can retain unacknowledged data for 7 days, can provide reliability through application-level acknowledgments, and is based on “at-least-once” delivery semantics. Pub/Sub also comes with an ability to store attributes which is for storing metadata of a payload in a key-value format. Some other perks we enjoyed with Pub/Sub are:

* **Global availability:** Pub/Sub acts as a global service and is available in all Google Cloud Zones; transferring data between our data centers wouldn’t be through our regular internet provider but would use the underlying Google network.
* **A simple REST API:** Since there is no library for Pub/Sub in Lua, we can quickly write our own publisher/subscriber by using their REST APIs.
* **Self Managed:** There was no need to create a capacity model or deployment strategy or to set up monitoring and alerting.

## Problem
The challenge arises when the lua-nginx module by default does not provide a way to push messages to Pub/Sub. Google Pub/Sub provides support for executing HTTPS requests for publishing messages. Still, Lua out of the box does not provide an interface for making external HTTP requests. So, there is a well-maintained library called [lua-resty-http](https://github.com/ledgetech/lua-resty-http) which helps us for doing the same. Using this library still doesn’t fix our problems completely. We need to come up with a solution that can handle a throughput of 30k requests/sec while maintaining non-blocking behavior. For handling such high throughput we can’t just pick one packet and execute a new HTTP request for the same, this would be highly unoptimized which would result in an increase in response time. Hence, we need to design a solution that could meet our requirements.

## Approaches

1. **Brute-force Approach**
    * For every request we receive at the DACDN end, we can form a payload out of it and then can execute HTTP requests for each of them separately. Though this approach is easy to Implement and highly intuitive, a highly blocking behavior will be experienced at the request sender's end, thereby increasing response time. High machine configs with more workers can overcome this, but it will ultimately lead to a higher system cost. Also, as per this [Google Doc](https://cloud.google.com/pubsub/pricing#message_ingestion_and_delivery): “A minimum of 1000 bytes per publish, push or pull request is assessed regardless of message size.” This implies that messages smaller than 1000 bytes are still billed for a whole 1000 bytes therefore also being cost-ineffective.

2. **Optimized Approach**
    1. Techniques that work for us in optimizing the publish rate
        1. **Data Batching at Worker level using timers:** This methodology reduced our response time by 3x when compared to publishing messages without it. Even this [Google Doc](https://cloud.google.com/pubsub/pricing#message_ingestion_and_delivery) advises pushing bulk data in publish requests for reducing cost. The idea is pretty simple but immensely effective. Steps are as follows:
            1. Accept the incoming request and form a data packet out of it
            2. Add this data packet in a buffer which is nothing but a Lua table that is used to hold packets for a while
            3. As soon as the batch size is reached:
                1. Initialize a timer that will work outside the worker context giving it a non-blocking characteristic.
                2. In this timer context, create a batch of data for the HTTP request body.
                3. Use the keep-alive property of HTTP connection reuse for getting the connection from the connection pool, if not present then a new connection will be automatically created.
                4. Use the connection and request body to execute an HTTPS request for publishing packet
                5. Remove the packets from the buffer that were successfully sent
            4. Above process repeats itself as the new data keeps on coming
        2. **Connection Reuse or HTTP keep-alive:** HTTP keep-alive, or HTTP connection reuse, is the idea of using the same TCP connection to send and receive multiple HTTP requests/responses, as opposed to opening a new one for every single request/response pair. It enhances HTTP performance by using less network traffic due to fewer setting up and tearing down of TCP connections and reducing latency on subsequent requests due to avoidance of initial TCP handshake.

    2. **Edge Case**
        * There can be a scenario where a certain topic’s batch is never going to be full or maybe filled very slowly due to low throughput. So, in that case, we also need to run a recursive nginx timer in the background that will be repeatedly fired up in a specific interval of time and will be responsible for checking any stale data present in the buffer. If yes, then create a batch of those remaining data and push them immediately to Pub/Sub.

    3. **Architecture**
        * Here is a very high-level overview of what is going on behind the scenes:

        <div style="text-align:center; margin: 10px;">
            <img src="../images/2020/11/lua-resty-pubsub-architecture.jpg">
        </div>

## Let’s proceed to the fun part - Benchmarking

The first thing we did was to test the optimized solution with Cloud Pub/Sub to see if it could handle the anticipated load. The primary purpose was to compare how our optimized approach performs against a simple initial brute-force approach. Our hope from this solution was that the system would be able to handle this traffic from the producer for a long time, without degrading the service.

With our new client in place, we were ready to start pushing some serious load to Pub/Sub. We used JMeter scripts with Taurus as a Load Testing tool to send mock traffic through our DACDN to Pub/Sub. Following machine configs were used while the load test was carried out:

* **DACDN:** 16 vCPUs, 16GB RAM
* **JMeter Machine:** 18 vCPUs, 33 GB RAM
* **Average Packet Size:** 1KB

Note: All these configurations were kept identical before running load tests on two solutions.

Here are the screenshots for Performance Testing Report and Stackdriver monitoring charts for the same load throughput but one without optimization and another with one.

1. **Figure 1:** Performance Testing Report when load sent to brute-force solution

    <div style="text-align:center; margin: 10px;">
        <img src="../images/2020/11/lua-resty-pubsub-figure1.png">
    </div>

2. **Figure 2:** Performance Testing Report when load sent to an optimized solution

    <div style="text-align:center; margin: 10px;">
        <img src="../images/2020/11/lua-resty-pubsub-figure2.png">
    </div>

3. **Figure 3:** Send Message operations count for brute-force solution

    <div style="text-align:center; margin: 10px;">
        <img src="../images/2020/11/lua-resty-pubsub-figure3.png">
    </div>

4. **Figure 4:** Send Message operations count for an optimized solution

    <div style="text-align:center; margin: 10px;">
        <img src="../images/2020/11/lua-resty-pubsub-figure4.png">
    </div>

5. **Figure 5:** Byte Cost for publishing messages to brute-force solution

    <div style="text-align:center; margin: 10px;">
        <img src="../images/2020/11/lua-resty-pubsub-figure5.png">
    </div>

6. **Figure 6:** Byte Cost for publishing messages to an optimized solution

    <div style="text-align:center; margin: 10px;">
        <img src="../images/2020/11/lua-resty-pubsub-figure6.png">
    </div>


## So what was the difference?
* Clearly, the first thing we can notice is a reduction in Average Response time from 7ms to 3ms which is quite significant. Also, 90% of Response times is reduced from 10ms to 4ms which was a huge boost.
* Due to low response time, Taurus was able to send requests at DACDN at relatively higher throughput thereby completing his 20M requests 12 minutes earlier than the brute-force solution.
* Also, the optimized solution has a higher “Send Message operations count” than the brute-force solution and due to this the same DACDN’s resources were much better utilized.
* There was a clear difference in cost in both approaches by 2.5 times. So it would be cheaper for anyone to use the optimized solution for publishing messages at better throughput.

## Solution as a Library
We definitely wanted other lua-nginx developers to benefit from this solution and thus we have open-sourced this approach as a library on GitHub. You can get the library from [here](https://github.com/wingify/lua-resty-pubsub) with detailed documentation for helping you out while incorporating this library in your system. If you feel that you can contribute to this library in any way then you are most welcome as an Open-source Contributor.

## Core Modules of the library
1. **producer.lua**
    * Responsible for accepting data from users, validating them, and finally normalizing the optional configurations
    * Creating as well as monitoring background nginx timers for data accumulation or data push
2. **oauth_client.lua**
    * Responsible for generating OAuth token for authorizing over https when making requests
    * It also maintains a local cache so that the same token can be used repeatedly before token expiry
3. **request.lua**
    * Maintains all the connection related configurations and errors
    * Responsible for actually making HTTPS requests to the Pub/Sub server for publishing packets
4. **ring_buffer.lua**
    * Module for storing the accumulated data in a table
    * Provide methods for push, pop, length, and bytes used for the queue

## Conclusion
Using a combination of Pub/Sub Rest API and Nginx Timers for batching, there are some obvious pros to it: 

- Better Pub/Sub write throughput in a non-blocking manner
- Reduced Cost by almost 2.5 times while publishing messages to Pub/Sub
- Improved response time and data acquisition

## Useful resources
* [Lua Nginx Module](https://github.com/openresty/lua-nginx-module)
* [Google Pub/Sub Rest API](https://cloud.google.com/pubsub/docs/reference/rest)
* [Google Pub/Sub Quotas and limits](https://cloud.google.com/pubsub/quotas)
* [Taurus Load Testing tool](https://gettaurus.org/)