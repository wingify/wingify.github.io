---
layout: post
title: "Open Sourcing DOM Comparator"
excerpt: Open Sourcing DOM Comparator
authorslug: himanshu_kapoor
author: Himanshu Kapoor
---

DOM Comparator is a JavaScript library that analyzes and compares two HTML strings, and returns back a diff object. It returns an output which is an array of operation objects.

<div style="text-align: center;">
	<a href="https://github.com/wingify/dom-comparator" style="padding: 20px 40px; font-size: 24px;" class="btn btn-primary">DOM Comparator on Github</a>
</div>

Here's a simple example:

{% highlight js %}
var stringA = '<ul><li class="active">list item 1</li><li>list item 2</li></ul>';
var stringB = '<ul><li>list item 1</li><li>list item 2</li></ul>';

// Compare the two strings
var result = VWO.DOMComparator.create({
    stringA: stringA,
    stringB: stringB
});

// Expect an array of VWO.Operation objects to be returned,
// the first one of which looks like below:
expect(result[0]).toEqual({
    name: 'removeAttr',
    selectorPath: 'UL:first-child > LI:first-child',
    content: {
        class: 'active'
    }
});
{% endhighlight %}

## Motivation

[The Campaign Builder](https://vwo.com/knowledge/about-vwo-campaign-builder) is one of the core components of our A/B testing software [VWO](http://vwo.com). It allows you to make changes to any website on the fly. Assuming the target website has a small snippet of [VWO Smart Code](https://vwo.com/knowledge/folder-vwo-smart-code) (Javascript) inserted, the changes made by the user are applied when the A/B test is run. These changes are little snippets of jQuery operations that are applied on the client-end.

One of the major problems faced when applying such changes that they did not regard for dynamic content that might have been rendered by the client's website's backend. Let us consider a simple example:

Imagine somebody wanting to run an A/B test on all the product pages of an eCommerce website. He wants to modify the "Buy Now" button on all such pages and make it appear bigger and bolder, so that it captures the end-user's attention better. He navigates to some product page, selects the button and tries to edit it. Assume that that button has markup that looks like below:

{% highlight html %}
<a href="javascript:addToCart(16);" class="add_to_cart">Add to Cart</a>
{% endhighlight %}

The Campaign Builder provides an "Edit" operation, that opens up a rich text editor for the user to make changes to any element with ease. Assuming, he makes the text of the button bolder and changes the color to a bright red, here's what the resulting markup would look like:

{% highlight html %}
<a href="javascript:addToCart(16);" class="add_to_cart" style="font-weight:bold;color:red;">Add to Cart</a>
{% endhighlight %}

Internally, an Edit operation is identified by the element the operation is applied on, and the new markup provided by the user, which in this case is the above code. It means that if a Buy Now button is found on any page, it will be replaced with the above code. The jQuery code for such an operation would look something like this:

{% highlight js %}
// A unique selector path to identify the element
var selector = '#product_description > P:first-child + P > A:first-child';
$(selector).replaceWith('<a href="javascript:addToCart(16);" class="add_to_cart" style="font-weight:bold;color:red;">Add to Cart</a>');
{% endhighlight %}

Notice how this would not only add the styles to that element, but also change its `href` to always execute `addToCart(16);` regardless of the product page the user is on. Essentially, the dynamic content rendered by the client's backend has now been replaced with static content.

## DOM Comparator to the Rescue

With DOM Comparator in place, the initial markup of the Edit operation above will be compared with the final one, and a differencewould be returned. The difference would contain the minimal changes necessary to be made to the target element, thereby impacting dynamic content as less as possible.

For the above example, here's what the list of resulting operations would look like:

{% highlight json %}
[{
    "name": "css",
    "selectorPath": "#product_description > P:first-child + P > A:first-child",
    "content": {
        "font-weight": "bold",
        "color": "red"
    }
}]
{% endhighlight %}

## Live Demo

[Click here](http://engineering.wingify.com/dom-comparator/live-demo.html) to view a live demo.

## What's Next

The library is currently in a pre-alpha state. It works well for a good number of cases, but does not for a lot of others. And for certain complex cases, it might not be performant enough.

Our current plans are focused on improving the library as per the below priority list:

* **Correctness**: For almost all the cases, the first priority is to get the output as correct as possible to the expectation. This has been our prime focus thus far.
* **Performance**: Once we ensure the cases perform correctly, the next task is to profile and optimize for performance. Since tree comparison is a pretty complex operation, we will be looking into possibilities like spawning a worker for performing tasks, or delegating to a Node.js server for comparison.
* **Readability**: For a complex algorithm, it is equally important for the code to be readable. In the coming versions, certain complex logic, especially in the classes `VWO.DOMMatchFinder` and `VWO.StringComparator` will be refactored from the point of view of readability.
* **Documentation**: Writing a documentation is as hard as writing code, if not more, is what I have realized when documenting this project. Over time, we will spend some time improving the documentation, and also release a reference manual for the classes used.

## Contributing

If you are interested in contributing to the project, we would love to hear from you. Just [fork the repository](https://github.com/wingify/dom-comparator/fork) and [submit a pull request](https://github.com/wingify/dom-comparator/pulls).

## Further Reading

Head over to [the documentation](http://engineering.wingify.com/dom-comparator/) if you'd like to know more.

