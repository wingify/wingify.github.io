---
layout: post
title: "Highlighted the Hacky Night - Sum It Up"
excerpt: Highlighted the Hacky Night - Sum It Up
authorslug: rachit
author: Rachit
---

I am a frontend developer at Wingify and I am building a really awesome product [PushCrew](https://pushcrew.com/). We had a hackathon last month, [glimpse of that](https://medium.com/@wingify/hacking-away-the-night-at-wingify-cbe33a39f28d). The idea was to <b>'Solve Daily Problems'</b>, interesting right? 😃

I am an avid reader and I read a lot of stuff on the web but I often find myself copying parts of different articles and pasting it in my notepad. I always thought it would be a great idea to have all my summaries at one single place. I wanted a platform that could show all the highlighted parts of articles I have liked without me having to juggle between different tabs. So instead of waiting for an app like this to be built, I went ahead and created a micro bookmarker at the hackathon.

<div style="text-align:center; margin: 10px;">
  <img src="/images/2017/05/jesus_meme.png" style="box-shadow: 1px 2px 10px 1px #aaa">
</div>

My idea was simple and I knew that I could build it alone. So I was a one-person team (Obviously Me 😛 ).

<div style="text-align:center; margin: 10px;">
  <img src="/images/2017/05/alone.png" style="box-shadow: 1px 2px 10px 1px #aaa">
</div>

The idea was not just to build but also to learn something new because that's the whole purpose of attending hackathon, right? Since I had never built a chrome extension before, I started reading about how to build the extension and took some guidance from our in-house [frontend God aka chinchang](https://twitter.com/chinchang457) 😛 . I devoted some good chunk of time to decide my strategy for building the product.

So after spending an entire night on Coke and Pizzas, I was able to build a beautiful extension which was working and solving at least my problem of highlighting parts of articles that I liked on the web. I really hope it will help a lot of people (read: readers) as well.

[Download](http://rachitgulati.com/sum-it-up/) this awesome application now 🤘 .

Here are the few glimpses of my hack.

<div style="text-align:center; margin: 10px; box-shadow: 1px 2px 10px 1px #aaa">
  <img src="/images/2017/05/sum_it_up_1.gif" alt="demo for sum it up">
</div>

<div style="text-align:center; margin: 30px 10px; box-shadow: 1px 2px 10px 1px #aaa">
  <img src="/images/2017/05/sum_it_up_2.gif" alt="demo 2 for sum it up">
</div>

<b>Prohibited content (Only for geeks):</b>

<i>As soon as you will select some text on the page (HTML) and right click on it, you will see the 'save to sum it up' option in the context menu. If you click on it, Sum It Up will save that highlighted data (color, text, DOM Node, page url, timestamp etc) in the JSON format of the local storage (so no privacy breaching) inside the chrome browser. The main challenge is to maintain the highlighter with the partial DOM selection which I have solved my putting the custom span tag to all the elements resides in that selection area.</i>

Some features that you might find useful are:
1. (High) light it up
2. Collect your notes
3. Email it
4. Searching made easy
5. Tweet your note
6. Are you a markdown lover? Yes you can export in markdown too
7. Directly jump to the micro section of the website

Sum It Up got featured on [product hunt](https://www.producthunt.com/posts/sum-it-up) too! Yippee :) (My first submit on product hunt and that too got featured, it's like Diwali Bonus 😀 )

PS: This is my first blog post so please be kind to me. I am open for any feedback 😀