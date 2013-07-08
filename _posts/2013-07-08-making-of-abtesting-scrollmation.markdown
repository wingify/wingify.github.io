---
layout: post
title: How We Made The Animated A/B Testing Guide
excerpt: How We Made The Animated A/B Testing Guide
authorslug: kushagra_agarwal
author: Kushagra Agarwal
---

Recently, we launched our first ever [animated guide to A/B testing](https://visualwebsiteoptimizer.com/what-is-ab-testing/) which made it to the top of [HN homepage](https://news.ycombinator.com/item?id=5993914) (Yay!). 

![](https://phaven-prod.s3.amazonaws.com/files/image_part/asset/956765/Xq0eqxVYXbzyZmOwI4nN5LDsLAw/medium_what.jpg)

In this post, I'll go through the process of how I created the page using HTML5 and JS. Let's get started! 


Setting up things
-----

I searched about some existing parallax scrolling JS scripts and came across [Skrollr.js](https://github.com/Prinzhorn/skrollr) which made my work a piece of cake! If you are going to create your own parallax scrolling page, then I would recommend you to use this library. Apart from that, I also used [scrollTo.js](https://github.com/yckart/jquery.scrollto.js) and [mousewheel.js](https://github.com/brandonaaron/jquery-mousewheel) for scroll handling.

Also, I wanted to make the images used in that page look sharp on retina screens so I used a little LESS mixin from [RetinaJS](http://retinajs.com/) to make sure that retina screens show the images @2x.


Getting started
----

After looking at some examples of Skrollr, I was ready to start building up the page. The best thing about Skrollr is that it automatically set things up for you and also handles the parallax scrolling on mobile devices. 

Now, I saved two versions (1x and 2x, for retina) of all the images and searched for a good _comic_ font. Each slide on that page is a mixture of some text and image elements. I gave each slide an `absolute` positioning and `100%` width and height. Also, each element in the slides are `fixed` positioned are made to appear and disappear using the `opacity` property. Here's the code for the first slide:

{% highlight html %}
  <!-- Slide 1 -->
  <div class=slide id=slide1>
    <div class=bob
      data-0=left: 0%; opacity:0;
      data-1000=left: 50%; opacity:1;
      data-3600=left: 50%; opacity:1;
      data-4800=left: 50%; opacity:0;>
    </div>

    <div class=text
      data-1200=opacity:0; bottom:0%; margin-bottom: 0 
      data-2400=opacity:1; bottom:50%; margin-bottom: -46px
      data-3600=opacity:1; bottom:50%; margin-bottom: -46px; right: 50%
      data-4800=opacity: 0; bottom: 50%; margin-bottom: -48px; right: 0%>

      Meet <strong>Bob</strong>
    </div>
  </div>
{% endhighlight %}


The only thing that Skrollr needs is the `data-px` attribute with some CSS properties passed in that attribute. Here, Bob will be at 0% left having 0 opacity at the start. Now if the user scrolls to 1000px, s/he would see Bob's image appearing from left to the center with increasing opacity. Thats how it works, you just need to time your animations in terms of pixels and Skrollr will handle it for you. Here, both `bob` and `text` are fixed positioned. To make things responsive, I first positioned everything to center using this:

{% highlight css %}
  .element {
    width: 100px; height: 100px;
    left: 50%; top: 50%;
    margin-left: -50px; 
    margin-top: -50px;
  }
{% endhighlight %}


After this, I altered the margins to position it perfectly so that on any resolution it will start from the center. I did the same thing for all the elements in each slide. Most of the elements are animated using CSS3 transforms while others are just faded in and out using `opacity` property. 


Scroll handling
-----

All this completed 80% of the page. Now, the only thing left was the scroll handling. I had to make sure that on each scroll, a slide should finish the animation properly and should not be left in between. To do this, I created checkpoints of the scroll position where each slide starts/ends. Now on each scroll, I incremented/decremented a counter based on the scroll direction. Based on that counter's current value the page is scrolled to the position from the checkpoints array and any other scroll event is ignored in that duration. Here's the code for this:

{% highlight js %}
  var i = 0;
  var checkpoints = [0, 3600, 6000, 11200, 14800, 17200];
  var timer = [0, 1000, 1000, 1500, 1500, 1500];

  function scrollDown() {
    if(i < checkpoints.length - 1 && percentage == 100) {
      i++;
      
      $(html, body).scrollTo(0, checkpoints[i], {
        animation: {
          easing: linear,
          duration: timer[i]
        }
      });
    }
  }

  function scrollUp() {
    if(i > 0) 
      i--;
      
    $htmlAndBody.scrollTo(0, checkpoints[i], {
      animation: {
        easing: linear,
        duration: timer[i]
      }
    });
  }
{% endhighlight %}

I also added keyboard navigation, and put some arrows on the page for easier navigation. Also, after getting reviews from some non-technical people, I added the auto-play option so that all the lazy people would still be able to watch the whole presentation without moving a finger :P

This almost completed the whole page. Last additions were creating a preloader for the page which loaded the images of first 5 slides with a progress bar and then rest of the images are loaded in the background. If you want, you can take a look at the [preloader.js](http://visualwebsiteoptimizer.com/what-is-ab-testing/js/preloader.js) to see how I did the preloading. Another thing was the share buttons and showing the count which was retrieved using PHP. 

I hope this covered everything but if you get stuck anywhere, then feel free to add your comments! :)