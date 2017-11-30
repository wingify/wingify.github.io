---
layout: post
title: "Why we have removed Inheritance/Extend from SASS and you should do the same!"
excerpt: Why we have removed Inheritance/Extend from SASS and you should do the same!
authorslug: chhavi_khandelwal
author: Chhavi Khandelwal
---

SASS is a preprocessor that provides features like variables, nesting, mixins, inheritance and other nifty goodies and makes CSS clean and easy to maintain.

The [@extend](http://sass-lang.com/guide#topic-7)  directive in SASS allows us to easily share styles between selectors.
But its usage can have adverse effects when used with bigger projects. Lets see how.

In [VWO’s](https://app.vwo.com) SASS code, we have more than 50 files. The need of inheritance removal came when the code started to become unpredictable and difficult to debug. Difficulty in debugging made us override the CSS as and when new requirement came; otherwise it requires a lot of time to understand existing code of inheritance before starting, so that any new rule addition does not break the existing CSS. That’s how the need of @extend removal came.

Here are the reasons why we discarded @extend.

## High maintainability 

{% highlight css %}
.title {
	text-transform: uppercase;
	font-size: 11px;
}

label {
	@extend .title;
	font-size: 13px;
}
{% endhighlight %}

…and in the end of the file somewhere adding,

{% highlight css %}
.title {
	font-size: 12px;
}
{% endhighlight %}

If this file is opened and looked up for the `label` rules, one would expect it to be of 13px but in reality, it will be of 12px.
`<label>I will always be 12px</label>`

This is because on compilation the result looks like this:

{% highlight css %}
.title , label {
	text-transform: uppercase; 
}

label {
	font-size: 13px; 
}

.title , label {
	font-size: 12px; 
}
{% endhighlight %}

`label` shares the rules at the last definition of `.title`.

If someone tries to override title and is not aware of the fact that it has been extended in some other class, the person might end up adding some wrong rules unintentionally.


## Difficult debugging
It becomes difficult to debug if the project’s CSS is large because you need to keep track of every extended class. If we consider the above example of `label` and `.title`, looking at the CSS in browser, it will be difficult for us to figure out the reason of font-size being 12px for `label`. It requires a lot of time of debug such code, especially if you have multiple SASS files.

## Increased file size
After we removed @extend from all our sass files, size got reduced from 164KB => 154KB

## Distributed Code
The code for one class should be contained at one place rather than distributed at many places. Classes or Placeholders extended in virtue of maintaining the code actually make it untidy and difficult to understand in case of multiple CSS files or long CSS code.
Here’s an example:

{% highlight css %}
.font--13 {
	font-size: 13px;
}

.tile {
	display: inline-block;
	border: 1px solid;
	@extend .font--13;
}

%size--200 {
	width: 200px;
	height: 200px;
}

.tile--200 {
	@extend .tile;
	@extend %size--200;
	font-size: 14px;
}

.circle--200 {
	@extend %size--200;
}
{% endhighlight %}

Generated Code:

{% highlight css %}
.font--13, .tile, .tile--200 {
	font-size: 13px;
}

.tile, .tile--200 {
	display: inline-block;
	border: 1px solid;
}

.tile--200, .circle--200 {
	width: 200px;
	height: 200px;
}

.tile--200 {
	font-size: 14px;
}
{% endhighlight %}

The generated code is highly unreadable and not at all lucid. This particular code has rules staggered at 4 places just for class .tile--200.

## Solution to @extend
We solved these problems with the help of [mixins](http://sass-lang.com/guide#topic-6) or directly writing the rule if it’s a one liner.

For e.g. in above example: SASS would be

{% highlight css %}
.font--13 {
	font-size: 13px;
}

@mixin tile {
	display: inline-block;
	border: 1px solid;
	font-size: 13px;
}

.tile {
	@include tile;
}

@mixin size--200 {
	width: 200px;
	height: 200px;
}

.tile--200 {
	@include tile;
	@include size--200;
	font-size: 14px;
}

.circle--200 {
	@include size--200;
}
{% endhighlight %}

Generated CSS code will be:

{% highlight css %}
.font--13 {
	font-size: 13px;
}

.tile {
	display: inline-block;
	border: 1px solid;
	font-size: 13px;
}

.tile--200 {
	display: inline-block;
	border: 1px solid;
	font-size: 13px;
	width: 200px;
	height: 200px;
	font-size: 14px;
}

.circle--200 {
	width: 200px;
	height: 200px;
}
{% endhighlight %}

This code has rules for every class maintained at just one place making it easier to understand and lucid which results in easy debugging and requires low maintenance.

All these reasons forced us to remove @extend from our SASS and hence our code and coders lived happily ever after!

**Cheers!**
