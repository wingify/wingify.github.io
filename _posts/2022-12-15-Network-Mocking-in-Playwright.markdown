---
layout: post
title: "Network Mocking in Playwright"
excerpt: "Network Mocking in Playwright"
authorslug: mohit_khanna
author: Mohit Khanna
---

<div style="text-align:center; margin: 10px; display: none">
  <img src="/images/2022/12/qaWingify.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

##The Requirement

In VWO, we have our client-side library which is executed on our customer’s website and it is the stepping stone of every feature that VWO possesses. Before jumping ahead, let me explain what our client-side library does.

##Our Client-Side Library

Like the heart pumps blood in our entire body, that is what the client-side library is for VWO. In a holistic way, our library is responsible for two major things which are as follows:-

1. Execute different experiments as per their specification and requirement which comprises A/B testing, Session Recordings, Heatmap, and many more.
2. Collect user insights as per the different products and their features.

**Note:-** To know more about our great products you can visit our website [https://vwo.com/](https://vwo.com/)

Now as simple as it may have sounded till now, let me tell you that it's not what it looks like. Though our Heart’s main job seems pretty simple, its intrinsic functionality is equally complex. Similarly, our client-side library does all the above-mentioned simple stuff with great precision and keeps serving our system with valuable data.

##Existing Automation Tool

As it is being said “Strong Automation Scripts build Strong Codebase”, probably by some QA guy I guess :-p, We at Wingify have built our automation scripts to keep our heart i.e. client-side library healthy. Until now we have been using Protractor which has always been there to our rescue in both health and sickness. Though it has served us well, but we have our share of challenges with it as listed below:-

1. No support to mock or verify network calls which is a must for our client-side library.
2. The future updates will be stopped post-2022.
3. Multi-browser support is not great.

##The Solution -> Playwright

Since Protractor is fast approaching its end of life we have been on the lookout and after exploring various options and in the end, Playwright was the one we settled with. For more details on why our heart falls for Playwright, you can check our detailed writeup [here](https://engineering.wingify.com/posts/playwright-the-rightful-heir/).

So, one of the major reasons for going with Playwright is its built-in support for tracking and mocking network calls, which is a major requirement for our new automation tool. Following are the 3 significant things that we can do with the network calls using Playwright which were useful for us:-

###-> Intercepting the Network

Playwright provides us with an easy way to just subscribe to the network requests and responses using the “page.on” method. Using this you can filter out any request and assert it in whatever way you want. The sample code is as under:-

<div style="text-align:center; margin: 10px;">
  <img src="/images/2022/12/page_on.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

It tracks any type of request including XHR and Fetch and using this, we can just write our custom method to filter out the requests of our choice and assert it accordingly. The custom method to filter out requests can be like this:-

<div style="text-align:center; margin: 10px;">
  <img src="/images/2022/12/custom_method.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

###-> Mocking the Network

One more magical method that Playwright equips is “page.route” using which we can handle, modify or abort any requests. It has some useful methods as explained below:-

* “route.fulfill” -> Using this we can mock the response which includes the status code, response body, and response headers.
<div style="text-align:center; margin: 10px;">
  <img src="/images/2022/12/route_fulfill.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>
In the above example, we have mocked the response of “fetch_data” api with testData, which can be any JSON of our choice, and the status code is mocked as 200. Using this we can mock the API’s data and may remove the dependency on other services for test data so that we can verify any service in silos.

* “route.continue” -> Using this we can mock the request that includes request headers, url, parameter, etc.
<div style="text-align:center; margin: 10px;">
    <img src="/images/2022/12/route_continue.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>
In the above example, we have deleted the “X-Secret” header from every request. Using this feature we can remove/update any header or payload which can help us to verify error cases and how our application behaves in such scenarios.

* “route.abort” -> Using this we can abort any request which can be helpful in creating specific negative testing scenarios where the network call get failed.
<div style="text-align:center; margin: 10px;">
    <img src="/images/2022/12/route_abort.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>
In the above example, all the requests ending with “png, jpg, jpeg” will be aborted.

###-> The Forever Wait

When you feel that this tool has everything you can ask for, it comes up with another great feature to surprise you and intrinsic wait for network requests and responses is one of them. Using this feature you can wait for any type of request or response after performing actions like click, scroll, mouse-hover, etc.
<div style="text-align:center; margin: 10px;">
    <img src="/images/2022/12/route_wait.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>
In the above example, we are waiting for the “https://example.com/resource” request after clicking the button as mentioned. If your application is slow, then this feature is nothing but a blessing in disguise and it will be handy to run the suite on a test environment as latency is generally a challenge there.


##Conclusion

Overall it is a great tool that is stuffed with a lot of useful features which can only make a QA guy’s life easier. Using these features we can make a sturdy test suite that can have more and more test cases without any limitations.  