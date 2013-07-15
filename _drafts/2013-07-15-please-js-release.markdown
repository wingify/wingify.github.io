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

Currently, please.js is an alpha release (0.1.0). Down the line, we would like to add features like support for communication in Chrome Extensions and improving the documentation to make it easier for all users to get started easily.

## How it works

The underlying concept is simple. Two frames need to communicate with each other asynchronously. To access one of the child frames on a page, the parent frame sends a `please.Request` to the child frame. The `Request` object is a lot like the request sent by the browser to a server. It contains information on what needs to be done in the child frame (call a function, get/set a property or a variable, or access a DOM node using jQuery). The child frame sends a `please.Response` back to the parent frame with the result of what the parent frame asked. For a function call request, it is the return value of that function, and for a get request, the value of the variable/property is returned.

## Contributing

If you would like to contribute, you can [submit an issue](https://github.com/wingify/please.js/issues) on GitHub. Will be great if accompanied by a failing test case and/or a pull request.

