---
layout: post
title: please.js - A simple PostMessage based communication library
excerpt: please.js - A simple PostMessage based communication library
authorslug: himanshu_kapoor
author: Himanshu Kapoor
---

In [one of our previous posts](http://engineering.wingify.com/posts/jquery-promises-with-postmessage/), we talked about the problems we faced when communicating with frames on a different domain in our application [Visual Website Optimizer](https://visualwebsiteoptimizer.com/), and highlighted the possible solutions to each of those problems.

We are proud to announce [please.js](https://github.com/wingify/please.js), a Request/Response based cross-domain communication. If you've ever faced problems in cross-domain frame communication, fear not - just say please!

## What is please.js

please.js is a Request/Response based wrapper around the PostMessage API that makes use of jQuery Promises. Here's a quick example to load an iframe window's location:

{% highlight js %}
var frameWindow = $('iframe').get(0).contentWindow;

please(frameWindow).call('window.location.reload');
{% endhighlight %}

please.js is based on top of jQuery and the jQuery Promise API. jQuery version 1.6 or above is preferred. To make the communication between two windows on different domains work, both of them must be injected with the same version of jQuery and please.js.

Currently, please.js is an alpha release (0.1.0), and we are working our way to add features like support for communication in Chrome Extensions and improving the documentation to make it easier for all users to get started easily.

## Contributing

If you would like to contribute, you can [submit an issue](https://github.com/wingify/please.js/issues) on GitHub. Will be great if accompanied by a failing test case and/or a pull request.

