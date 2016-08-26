---
layout: post
title: "Secure Your Web Application @JSChannel Conference ’16"
excerpt: This post describes my first speaking experience at JSChannel Conference 2016 and what I learned from it.
authorslug: dheeraj_joshi
author: Dheeraj Joshi
---


Recently, I spoke about securing Web Applications at [JSChannel Conference ’16][1]. The conference venue was The Ritz-Carlton, Bangalore.
JSChannel is a great conference to attend and to connect with some great people. And when I say great, I literally mean it. We met with Yehuda Katz (one of the creators of Ember.js), Lea Verou (Expert in the W3C CSS Working Group) & Christian Lilley (Father of SVG) and experts from McKinsey.

<p style="text-align: center;">
    <img width="480" height="360px" src="/images/2016/08/jschannel_speakers.jpg">
</p>

Three Wingifighters flew to attend and listen to this amazing conference and here we are, showing off some swag.🤘

<p style="text-align: center;">
    <img style="width:320px !important" src="/images/2016/08/jschannel_swag.jpg">
    <img style="width:320px !important" src="/images/2016/08/wingifighters.jpg">
</p>

Day 1 was amazing. Rachit, having attended almost all the sessions, has shared his learning experience at the conference on the [Team Wingify’s Space][2].

### Before The Talk

Speaking at a conference involves a lot of work before getting on stage. Preparation is crucial. I spent a good number of hours to jot down a list of security vulnerabilities to talk about and steps to mitigate them. I had to make sure none of my demonstrations exposed the vulnerabilities of the websites I chose to talk about.

And guess what, in my preparation for the demo, I actually found another way to bypass a previously reported vulnerability in time just before the conference.
Keeping in mind the JavaScript conference and the audience, I made sure everything was related to Browser level and Node.js application attacks.

### The Talk

<div style="width: 100%">
    <script async class="speakerdeck-embed" data-id="73bbddb59072472a88de3b22005089f1" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>
    <p>For the video, scroll down to the end of the post.</p>
</div>

It all started with a humorous introduction and a show of my prowess!
> Security is like the elephant in the room where everyone agrees that it's very important but only a few take it very seriously.

I touched upon the recent Github reused password attack and why we should follow a good password hygiene and move towards multi-factor authentication (MFA).

#### XSS

<img src="/images/2016/08/jschannel_xss.jpeg">

**Rule of thumb**: Validate input and escape output

#### CSRF

XSS + CSRF = Game Over!

I've developed a sample web application using Node.js, Express and Angular that is vulnerable to common security vulnerabilities were demonstrated. <a href='https://github.com/djadmin/vulnerable-app' target='_blank'>Click here to see the code.</a>

#### What could possibly go wrong?

The talk ended with a live demonstration of an interesting and serious vulnerability found on a popular hiring platform, RecruiterBox. A JavaScript injection using which an attacker can upload a maliciously crafted resume and can perform Cross-site Scripting attacks. I used Burp Suite, an interceptor proxy to bypass the fix deployed by Recruiterbox, for demonstration purposes.

To know more about the vulnerability, [click here][3].

### Feedback:

After the talk, it was rewarding to see a good response and interesting queries from the audience. One comment I received from audience was "We have just realized that our services are vulnerable to one of the attacks you have demonstrated and we never gave a thought to it. Thank you!".

<script>Galleria.run('#jschannel-gallery');</script>
<div id="jschannel-gallery" style="height: 400px;">
    <img src="/images/2016/08/jschannel_resp1.png">
    <img src="/images/2016/08/jschannel_resp2.png">
</div>


__My 2 cents for attending any tech conference__

More than the talks themselves, it is the people that you should attend the conference for. You should meet the other attendees! If a particular talk is interesting and useful then you can and should talk to the speaker.

__Key takeaways:__

1.  Never blindly trust user input.
2.  Always use proven sanitizers and tools.
3.  Perform security audits.
4.  Keep discussing vulnerabilities because the Internet has a bunch of weird old stuff that, not necessarily, every software developer knows about.


#### Video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/XaHkHBtth-U" frameborder="0" allowfullscreen></iframe>

As a first-time speaker, I wasn’t sure what to expect. It turned out to be a great experience and received very positive feedback.

  [1]: http://2016.jschannel.com
  [2]: http://team.wingify.com/a-wingifighters-account-of-speaking-and-listening-at-the-jschannel
  [3]: https://medium.com/@dheerajhere/hiring-made-so-easy-security-write-up-c717a152c21c



