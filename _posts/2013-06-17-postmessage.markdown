---
layout: post
title: jQuery Promises: The answer to PostMessage's asynchrony
excerpt: jQuery Promises, the answer to PostMessage's asynchrony
permalink: /postmessage/
date: 2013-05-14 01:12:02
authorslug: himanshu_kapoor
author: Himanshu Kapoor
---

Visual Website Optimizer’s Editor component loads a website for editing using a
proxy tunnel. It put a big restriction on what kind of websites could be loaded
in it. Websites behind a firewall, the ones on a local network, or behind HTTP
authentication could not be loaded using the tunnel. Other than those, even if
the website did load in the editor, chances were that it could break on the
frontend due to issues with JavaScript or AJAX communication.

You’d ask: why is there a proxy in the first place? Because, if a page contains
an iframe on another domain, it cannot access its properties or functions. It is
a security feature that browser vendors offer users to protect their privacy.

## The Problem

So, our task at the frontend recently was to eliminate this troublesome
middleman and find a solution for cross-domain iframe communication. We knew
what the answer was: the [PostMessage API](https://developer.mozilla.org/en-US/docs/Web/API/window.postMessage).
Provided a customer had VWO tracking
code integrated on their website, we could load the iframe directly without a
proxy and communicate with it using this API. The bigger question, however, was
how to do it. The Editor had a lot of parent-child communication going under the
hood for every task the user performed.  When attempting to use PostMessage for
this communication, we were faced with a couple of issues: 


- Our legacy code had direct communication between the parent frame and the
child frame at all places, i.e. the objects and functions in the child were
accessed synchronously. PostMessage API, on the other hand, is completely
asynchronous, and implementing such an API on the existing codebase would almost
mean rethinking the entire logic and program flow all over again.  We could
foresee this asynchronous transition become a cause of a lot of race conditions
within the Editor.

- Often, after sending a message to the other frame, we wanted to hear back a
reply, for which we needed a decent two-way communication. A kind that would
keep track of the sender and the receiver and could be identified across iframes
using a unique identifier (to tie up the requests and responses).

- Since PostMessage uses string messages for communication (or [structurally
cloneable](https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/The_structured_clone_algorithm)
objects in the recent browsers), it put a big limit on what kind of
data we could send during this communication. Directly accessing DOM nodes and
sending around certain cyclic objects was no longer possible.


For instance, when you select an element in the child frame, it creates a new
`VWO.Element` instance in the parent frame and asks it to open a context menu. The
code looked something like this:

{% highlight js %}
  $(elementSelectorPath).click(function() {
    var element = parent.VWO.Element.create(elementSelectorPath);
    parent.VWO.ContextMenu.showForElement(element);
  });
{% endhighlight %}

While, it might seem like a trivial problem to solve on the cover, deep
underneath, we were faced with a race condition. The `Element.create` method
asked the child frame to add a class to that element, and the
`ContextMenu.showForElement` expected the class to have been applied by the time
it was executed.


## The Solution

We concluded that refactoring the code to adapt to the asynchrony would be one
hell of a task and we had to find another way. We decided to write a wrapper
around the PostMessage API to solve the above three problems. We called it
`please.js`. We are currently giving it some finishing touches before we push it
out to the community. Here’s how we did it:

- We decided to build this library on top of jQuery Deferred API. While
deferred objects and promises don’t exactly eliminate the asynchrony, they
somehow bridge the gap between the two, making asynchronous code feel more
linear and flattened. So, using that base, any piece of code that expected code
prior to it to have been executed fully, could now be made possible without
giving a lot of thought. In the above example, the transition to please.js
looked like this:

{% highlight js %}
  $(elementXPath).click(function() {
    please(parent)
      .call(‘VWO.Element.create’, elementXPath)
      .then(function (element) {       please(parent)
          .call(‘VWO.ContextMenu.showForElement’, element);
    });
  });
{% endhighlight %}

Although this seems hackish at the first glance, it was a way to rapidly
iterate over synchronous code and convert it to use promises and callbacks
without giving much thought on the logic.

- To establish a good two-way communication, we thought of thinking of each
communication as a pair of messages: a request and a response. Under the hood,
we identified each message using a timestamp it was initiated on, and created a
request object with that identifier. We then send the request to the other
frame, whilst storing it in the current frame in a hashmap. The other frame
would then receive the request, perform an appropriate action and send back a
response. After a response is received, the request would be deleted from the
hashmap. To make things easier for us, we created a set of functions to make
certain frequent tasks easier. For instance, getting / setting a property and
calling a function were the most common tasks we performed. The code for these
tasks now looked like this:

{% highlight js %}
  please(parent).get(‘window.location’).then(function(location) {
    // use location here
  });

  please(parent).set(‘foo’, ‘bar’).then(function () {
    // do something here
  });

  // reload the child window.
  var childWindow = $(‘iframe#child’).get(0).contentWindow;
  please(childWindow).call(‘window.location.reload’);
{% endhighlight %}

A paradigm shift, yet the logic remained unaffected. Exactly what we wanted.

- The last task was a big one. We had a lot of code in the parent frame
directly accessing the child frame’s DOM. While this is not advocated as a good
practice, such problems are often faced when building upon and improving legacy
code. With PostMessage, you can no longer access the child’s DOM in any way.
But we came up with a smart solution. We know that jQuery is a wrapper around
the traditional DOM. We created a PostMessage wrapper around jQuery itself!
Which makes impossible turn possible:

{% highlight js %}
// set #bar’s height in child = foo’s height in child
var pls = please($(‘iframe#child’).get(0).contentWindow);
pls.$(‘div#foo’).height().then(function (fooHeight) {
  pls.$(‘div#bar’).height(fooHeight);
});

// DOM elements are returned back as please.UnserializableObject
// which can then be passed back to please.$ to do more stuff
pls.$(‘<div>hello world</div>’).then(function (newDiv) {
  pls.$(newDiv).appendTo(‘body’);
});
{% endhighlight %}

This was something that I thought of during one of the [hackathons](http://team.wingify.com/friday-engineering-talks-at-wingify)
we host at Wingify. Turned out to be very fruitful!

## Conclusion

In my personal opinion, I believe using promises for such a large transition
has greatly impacted the way I think about frontend web development. It is a
way forward for rapid asynchronous development, and yet having a flattened
synchronous-like code structure.

`please.js` will be opensourced soon, so keep an eye out on the blog for updates!
