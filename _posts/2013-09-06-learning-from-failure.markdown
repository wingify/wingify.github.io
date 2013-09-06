---
layout: post
title: Learning from Failure - Lessons Learnt from a Failed Project
excerpt: Learning from Failure - Lessons Learnt from a Failed Project
permalink: /learning-from-failure/
date: 2013-09-06 00:00:00
authorslug: himanshu_kapoor
author: Himanshu Kapoor
---

About a year ago, we began working on a project. We believed that one of the components of our product [Visual Website Optimizer](http://visualwebsiteoptimizer.com/), the JavaScript based visual editor had begun to get increasingly complex as time went on, and thought it was in best interests of future development to take that piece apart and rethink how it would be done if we were to start afresh today. That would make future development on that component a breeze and reduce a lot of friction that currently comes across when adding a new component to the editor.

It all began with might and main, but the journey slowly started to deteriorate and eventually resulted in failure. In this post I will point out what went wrong, the lessons we learnt, and how we would do it if we were to start all over again.

## What went wrong?

We started off with some research and began working on a prototype for the editor. We decided to bootstrap the project by leveraging one of the open-source frontend libraries. For about a week and a half, we played around with [Backbone.js](http://backbonejs.org/), [Ember.js](http://emberjs.com/), [Angular.js](http://angularjs.org/) and [Knockout.js](http://knockoutjs.com/). The decision tilted in the favour of Ember.js, and it appeared to be a perfect fit for our project back then.

### 1. It began with a clean slate.

While all new products once began with a blank canvas, this was not a new product. The product already was out there in the market with several people using it. We began with a prototype using Ember.js as a proof-of-concept of how the product might shape up and become more flexible if done in this new way. But what we did not realize was that, in fact, we were *rewriting* the entire thing from scratch. Depending on the situation, a software product rewrite might [do wonders for your product](https://blog.twitter.com/2011/twitter-search-now-3x-faster), or [might even destroy your company](http://www.joelonsoftware.com/articles/fog0000000069.html).

A prototype or a proof-of-concept always begins with a clean slate, and that's perfectly fine. But for an existing software, if the prototype works well, it is time to move on and take the learnings from the prototype and incrementally implement in your application by continuous refactoring and creating unit tests. What we did instead was that we considered the prototype a base of our project and began implementing the already existing features in the application one-by-one. Which brings me to point 2.

### 2. The end goal was not very clear.

One of my colleagues and I had been assigned to this project, and both of us were new joinees. We had limited knowledge of the features that existed in the current version of the visual editor, and were based mostly out of the limited time we had spent playing around with the tool and its codebase. So when drafting out the project plan or *spec* for the project which would include details about project architecture, time estimates and a milestone breakdown of various components would be based on our limited vision of the product and we would miss out on a certain major things. And later on, during time-critical moments when we would realize that a certain feature was absent in the new version, but worked very well in the old version, a series of blame games would begin. But I'm only speculating it would've gone bad. It was a lot worse, because...

### 3. The project plan did not exist.

The project design phase of an ideal software development life cycle includes a major task: Planning. We did have some planning sessions and talked verbally about the tasks ahead in the project. But nobody ever *wrote them down*. For projects as large as this, a detailed breakdown of tasks and estimates is critical to have a 'bird's eye' view of the project early on. Else the end product becomes an unstable tower with a weak base.

Somebody wise once said *"A few weeks of planning can save you several months of programming."* And looking back, it does seem like that was the case for our project. We planned for a bit, worked on a prototype and jumped right to programming for the end product without a very clear direction.

The mistakes above are something we never realized we had made until we were deep into the project. We were motivated by the exciting project we had at hand, some of the exciting new technologies we were working with (including Ember.js, [rake-pipeline](https://github.com/livingsocial/rake-pipeline)) and for me personally, this was perhaps one of the most amazing projects I had worked on in my life. And that brings me to point 4.

### 4. The project became too personal.

There was a moment in time when I felt the project was truly amazing, and I felt proud of the design and architecture the codebase had. It was the largest and most complex piece of code I had ever written. And it was something I could truly call *beautiful*. But along with the other mistakes we had made in the beginning, looking back, this seemed like another mistake. 

Between doing just the bare minimum to get the project across and pouring your heart and soul into a project to go beyond expectations, there exists a fine line that when crossed leads to disastrous consequences, which can go beyond just messing up your routine, personal life and relationships. Where and when you draw this line depends on you, your project and it comes with experience. 

Often I would find myself working on the project on odd hours after midnight and during weekends and sometimes even doing over 16 hour-long sprints to refactor a certain component of the codebase. This feeling of the project becoming too personal made me want to continue the project despite knowing the problems it had compared to the version that already existed, instead of discarding it, going back and doing it the right way.

And besides, there were too many flaws. Each change would break something else that used to work before. While our codebase was modular, there were still certain dependencies which existed in the codebase which caused a *ripple effect* each time something was touched. And here's the reason:

### 5. We never did any real automated testing.

We continuously pointed out how automated testing was critical for our codebase and had even agreed when we started out that we couldn't do without them. But a few months of rapid code down the line, we were happy with how we got so much done in so less time. But this progress was only logarithmic. Since we did not have any kind of tests running, with each rapid iteration, the code kept getting more complex and eventually got out of hand. Had we taken some time out and written some tests to go alongside whatever we wrote, it would've made the whole process a little slower, but we'd be much better off than we were now. Kent Beck, the author of Extreme Programming sums it up quite nicely:

*Programs have two kinds of value: what they can do for you today and what they can do for you tomorrow. Most times when we are programming, we are focused on what we want the program to do today. Whether we are fixing a bug or adding a feature, we are making today’s program more valuable by making it more capable.*

*You can’t program long without realizing that what the system does today is only a part of the story. If you can get today’s work done today, but you do it in such a way that you can’t possibly get tomorrow’s work done tomorrow, then you lose.*

## How do we fix it?

We knew we had made mistakes when we began, and it is never too late to fix them. Unfortunately though, since the project had such a weak base, it would mean starting all over with what we had learnt. And we did that. We have taken our learnings and have begun to do it the right way. To ensure a smooth software development experience, we will make sure we follow the below mentioned best practices:

### 1. Never reinvent the wheel.

In this ever progressing world of Information Technology, new things keep coming up each day. And if we spend our time re-doing something that has already been done, it will be impossible for us to play catch up with rest of the world. Often one of the reasons for redoing a piece of code is that the old logic is messy and unreadable. And usually, such remarks are made after just a little glance at the old code. "I could rewrite this better in lesser time than it would take me to understand and work on the old code", thinks the programmer. While the programmer might be able to reinvent the wheel in given time, the wheel will probably be missing a few nuts and bolts here and there. He never really understood fully how the old logic worked, which would have only been possible by reading and understanding the old code.

### 2. Plan ahead and plan well.

Software design principles dictate that project planning is one of the most critical phases of the project. Having brainstorming sessions for outlining and planning are all good, but it is of no good unless things are written down and set in stone *before* the project begins. The human brain is capable of remembering only so much information. Something along the lines of a *project spec* always comes in handy. Make use of tools like [Workflowy](https://workflowy.com/), [Trello](https://trello.com/), [Google Docs](https://docs.google.com), a text file, or just plain old pen and paper to plan your project.

And planning is also an ongoing process. For one can never foresee their journey well in advance. The written plan should be kept updated if the project requirements change at any moment.

### 3. Refactor, test, deploy, document.

For a large piece of software that already exists in the market, one should never rewrite it like ever, whatever the reasoning may be. Instead the approach to follow is to refactor, test and deploy. Take a small piece of code or a module from the application, refactor that piece and *most importantly* write automated test for that piece. When it is well-tested, deploy it into production. Each little refactor and automated test will pave the way for a better codebase. Not just that, this process would take significantly lesser time than a rewrite would and would not run the risk of fading into oblivion (becoming a vapourware).

With each deployment, one should also spend time documenting what has been done, how it was done and what is the road ahead. It is one of the critical pieces of software development that mostly gets overlooked. If a project remains dormant for a couple of months, it is very difficult to get back to it unless some sort of documentation exists. Also it makes the lives of new joinees a lot easier.

### 4. Never stop learning.

Keeping yourself up to date with the happenings in the world around you is equally critical for software development. Especially being up to date about the technologies you are making use of to develop our application. We had built our application on top of Ember.js, and while we left no stone unturned at the beginning of the project with regards to our research, but as the project went on, we fell short and [missed out some of the critical updates](http://emberjs.com/blog/2012/08/03/ember-1-0-prerelease.html) that the folks working on Ember.js had in the pipeline. The end result was that when Ember.js RC1 came out, it was a massive transition which we were not prepared for. Had we kept due tab on the developments with Ember, we would have planned accordingly. I guess this is what comes with dabbling with new and experimental technologies. But then again, you can never play too safe.

### 5. Keep the momentum going.

Finally, one of the most important tasks is to find ways to keep your momentum up. For me, [maintaining a strong GitHub streak](http://d.pr/i/tNdw) was a big motivator, telling me to continue going and find ways to not break my streak. It dramatically multiplied how productive I was. So much so that I have begun to use graphs and data points to bring motivation to other aspects of my life as well.

Its different for everyone, and its just a matter of finding it. Find what motivates you and hang on to it for as long as you can.

## Conclusion

In the end, the project might have failed, but the learnings we gained from the project have been invaluable. Quoting Brandon Hull from his book [Fablehaven](http://www.amazon.com/Fablehaven-Brandon-Mull/dp/1416947205), *"Smart people learn from their mistakes. But the real sharp ones learn from the mistakes of others."*

We have learnt from our mistakes, and we hope the sharp readers learn from ours. 