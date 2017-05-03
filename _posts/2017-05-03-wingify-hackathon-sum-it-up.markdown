---
layout: post
title: "Wingify Hackathon - Sum It Up"
excerpt: Wingify Hackathon - Sum It Up
authorslug: rachit
author: Rachit
---

I am a frontend developer at Wingify and I am building a really awesome product, [PushCrew](https://pushcrew.com/). Last month, [we had a hackathon](https://medium.com/@wingify/hacking-away-the-night-at-wingify-cbe33a39f28d). The idea was to <b>'Solve Daily Problems'</b>, interesting right? 😃

<div class="post-info-box">
  <p>This post is a part of March'17 Hackathon Project series. Here are the other posts in the series:</p>
  <ul>
    <li>
      <a href="/posts/wingify-hackathon-vwo-xray/">
        VWO X-Ray
      </a>
    </li>
  </ul>
</div>

I am an avid reader and I read a lot of stuff on the web, but I often find myself copying parts of different articles and pasting in my notepad. I always thought that it would be a great idea to have all my summaries at single place. I wanted a platform that could show all the highlighted parts of the articles that I have liked without me having to juggle between different tabs. So instead of waiting for an app like this to be built, I went ahead and created a micro bookmarker at the hackathon.

<div style="text-align:center; margin: 10px;">
  <img src="/images/2017/05/jesus_meme.png" style="box-shadow: 1px 2px 10px 1px #aaa">
</div>

My idea was simple, and I knew that I could build it alone. So I was a one-person team (Obviously me! 😛 ).

<div style="text-align:center; margin: 10px;">
  <img src="/images/2017/05/alone.png" style="box-shadow: 1px 2px 10px 1px #aaa">
</div>

The idea was not just to build, but also to learn something new because that's the whole purpose of attending a hackathon, right? Since I had never built a Chrome extension before, I started reading about how to build an extension and took some guidance from our in-house [frontend God, a.k.a chinchang](https://twitter.com/chinchang457) 😛 . I devoted some good chunk of time to decide my strategy for building the product.

So, after spending an entire night on coke and pizzas, I was able to build a beautiful extension which was working, and solving, at least my problem of highlighting parts of articles that I liked on the web. I really hope it helps a lot of people (read: readers) as well.

[Download](http://rachitgulati.com/sum-it-up/) this awesome application now 🤘 .

Here are a few glimpses of my hack.

<div style="text-align:center; margin: 10px; box-shadow: 1px 2px 10px 1px #aaa">
  <img src="/images/2017/05/sum_it_up_1.gif" alt="Sum It Up demo">
</div>

<div style="text-align:center; margin: 30px 10px; box-shadow: 1px 2px 10px 1px #aaa">
  <img src="/images/2017/05/sum_it_up_2.gif" alt="Another Sum It Up demo">
</div>

<b>Prohibited content (Only for geeks):</b>

<i>As soon as the user selects some text on the page (HTML) and right clicks on it, (s)he is shown an option to 'Save to Sum it up' in the context menu. On clicking the option, Sum It Up saves the highlighted data (color, text, DOM node, page URL, timestamp etc.) in the JSON format to the local storage (so no breachment of privacy) inside the Chrome browser. The main challenge was to maintain the highlighter for the partial DOM selection which I have solved by putting the custom span tag to all the elements which reside in that selected area.</i>

Some features that you might find useful are:
1. (High) light it up.
2. Collect your notes.
3. Email them.
4. Searching made easy.
5. Tweet your note.
6. Are you a markdown lover? Yes you can export in markdown too.
7. Directly jump to the micro section of the website.

Sum It Up got featured on [Product Hunt](https://www.producthunt.com/posts/sum-it-up) too! Yippee :) (My very first submission on Product Hunt and that too got featured, it's like Diwali Bonus 😀 )

PS: This is my first blog post so please be kind to me. I am open to any feedback 😀