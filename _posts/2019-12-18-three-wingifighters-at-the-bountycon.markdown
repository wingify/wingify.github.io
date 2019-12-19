---
layout: post
title: Three Wingifighters at the BountyCon
excerpt: Three Wingifighters at the BountyCon
author slug: varun_pk
author: Varun PK
---

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;On March 29th, 2019, our team members [Ankit Jain](https://twitter.com/ankneo), [Dheeraj Joshi](https://twitter.com/dheerajhere) and I had the privilege to attend a very exclusive event called [**BountyCon**](https://www.facebook.com/notes/facebook-bug-bounty/introducing-bountycon/2415701251777420/) in Singapore at Facebook APAC HQ. This was an invitation-only event organized by **Facebook** and **Google**, that gave Security Researchers and University Students an opportunity to hear from some of the brightest minds in the field of **Bug Bounty Hunting.** The purpose of BountyCon was to bring together researchers from all over the Asia-Pacific region under one roof to collaborate, network and submit security flaws across both platforms during the live hacking event. In this blog post, I will cover my experience with the BountyCon, how the conference turned out, impression on the CTF event, and overall thoughts about the Conference experience!

## How did we get the invitation?

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In January 2019, Facebook and Google launched a **Capture the Flag** competition (CTF) for the first time to identify new whitehats in the Asia-Pacific region. Like everyone, we signed up for this competition and were super excited about this event.

So there were several reasons that led me to attend this competition:

* **Chance to visit Singapore:** 
Top 20 winners were to be awarded free flight tickets and accommodations in Singapore to attend the event.

<div style="text-align:left;margin:50px">
  <img src="https://static.wingify.com/gcp/uploads/sites/5/2019/12/excited.gif" style="box-shadow: 2px 2px 10px 1px #222; width: 320px; height: auto;">
</div>

* **Meeting new Researchers:**
How could I miss a chance to be in an environment where everyone speaks your language.

<div style="text-align:left;margin:50px">
  <img src="/images/2019/12/harry_potter.gif" style="box-shadow: 1px 1px 10px 1px #222; width: 320px; height: auto;">
</div>

* **Facebook, Singapore HQ:**  - Yes!
The venue for this event was at the Facebook office and I was thrilled to visit their new APAC HQ.

<div style="text-align:left;margin:50px">
  <img src="/images/2019/12/facebook_office.jpg" style="box-shadow: 1px 1px 10px 1px #222; width: 320px; height: auto;">
</div>


* **Facebook and Google swags:** Just a cherry on the top!

Anyways, the objective of this competition was to perform passive recon (the number of flags planted wasn&#39;t revealed) against the target (Google and Facebook) and capture as many flags as possible. Most of the challenges were related to OSINT and some of them were related to Web, Cryptography, steganography, and Reverse Engineering.

I started the challenge by googling &quot; **Bountycon**&quot; and at the end of the search, I got a flag inside security.txt file ;)

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/security_txt.png" style="box-shadow: 1px 1px 10px 1px #222; width: 420px; height: auto;">
</div>


After capturing the first flag I felt a sense of adrenaline build up inside of me. Over the next two hours, I continued hammering away at my keyboard, consequently solving a few more challenges.

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/hunting_mode.gif" style="box-shadow: 1px 1px 10px 1px #222; width: 420px; height: auto;">
</div>


A problem that was both interesting and challenging was the **Deeplink challenge**. It involved reverse-engineering facebook app and reconstructing the flag from assembly code. So here is how I solved this challenge, thanks to [Manish Gill](https://twitter.com/mgill25) for pointing me in the right direction.

The first thing that comes to mind when relating CTF and the executable(APK) file is Reverse-Engineering.

I quickly downloaded the latest app from [https://www.facebook.com/android\_upgrade](https://www.facebook.com/android_upgrade).

Using the all-purpose decompiler [tool](https://ibotpeaches.github.io/Apktool/) as my first resort, I found the first flag in the AndroidManifest.xml file.

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/bountycon_manifest_flag.png" style="box-shadow: 1px 1px 10px 1px #222; width: 820px; height: auto;">
</div>

But wait, **this is not the solution for Deeplink Challenge** :P

The second flag was even more elusive. To solve the Deeplink challenge, I had to download and decompile the previous release of the facebook app.

I downloaded the previous-release(Facebook 203.0.0.16.293) of the Facebook app from [**apkmirror**](https://www.apkmirror.com/apk/facebook-2/facebook/facebook-203-0-0-16-293-release/) and decompiled the resources using apktool.

After searching for some time, I found an interesting file called PSaaActivity.smali.

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/bountycon_deeplink_flag.png" style="box-shadow: 1px 1px 10px 1px #222; width: 420px; height: auto;">
</div>

after going through the assembly code and some debugging I finally found the second flag **BountyCon{cr4zy\_d33pl1nk\_m461c}**.


By the end of the competition, I solved 18 challenges and earned a total of 943 points. Though it was nowhere near the 1200+ points achieved by Ankit and Dheeraj, I really enjoyed the competition :P :P

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/bountycon_score.png" style="box-shadow: 1px 1px 10px 1px #222; width: 750px; height: auto;">
</div>

After a couple of days, the three of us got an email from the Facebook team and we were delighted to know that we were selected as one of the top 20 winners from the APAC zone.

## Meeting the legend Jeff Moss

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;On March 28, we started from Delhi at around 11:00 PM and we reached Singapore on Friday morning. After a quick fresh-up at our hotel, we headed out for a walk in the city and ended up at Starbucks.

While we were chilling at Starbucks, Dheeraj got to know about an event &quot;[ALIBABA SECURITY Meetup](https://www.meetup.com/A-CON-Meetup/events/259861622/)&quot; on twitter. This was a security meetup that was hosted by the Lazada security team and the Alibaba Security Response Center. So, quickly we guys registered ourselves on their online forum and set out to attend the meetup.

We reached at around 7:00 PM to the venue of the meetup, Lazada Visitor Centre. After the opening ceremony, we had a chance to meet and greet the legend [Jeff Moss](https://twitter.com/thedarktangent), Founder of [**Defcon**](https://www.defcon.org/) and [**Blackhat**](https://www.blackhat.com/). It was a great honor to meet him in person!

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/alibaba_1.png" style="box-shadow: 1px 1px 10px 1px #222; width: 700px; height: auto;">
  <div style="text-align:center;margin-top:5px;">
  	Picture Courtesy: <a href="https://twitter.com/AsrcSecurity">@AsrcSecurity</a>
  </div>
</div>

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/alibaba_2.png" style="box-shadow: 1px 1px 10px 1px #222; width: 300px; height: auto;">
  <div style="text-align:center;margin-top:5px;">
  	Picture Courtesy: <a href="https://twitter.com/AsrcSecurity">@AsrcSecurity</a>
  </div>
</div>

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/alibaba_3.png" style="box-shadow: 1px 1px 10px 1px #222; width: 700px; height: auto;">
  <div style="text-align:center;margin-top:5px;">
  	Picture Courtesy: <a href="https://twitter.com/AsrcSecurity">@AsrcSecurity</a>
  </div>
</div>

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/alibaba_4.png" style="box-shadow: 1px 1px 10px 1px #222; width: 700px; height: auto;">
  <div style="text-align:center;margin-top:5px;">
  	Picture Courtesy: <a href="https://twitter.com/AsrcSecurity">@AsrcSecurity</a>
  </div>
</div>

The rest of our day consisted of an awesome dinner and afterward, we returned to our hotel and called it a night.

## First Day of BountyCon

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;On the 30th March 2017, the first day of BountyCon, We reached at around 8:30 AM to the venue of BountyCon, Facebook APAC HQ. After registration, we got a cool badge, a BountyCon goodie bag with Google Tshirt, a BountyCon hoodie, a thermos flask and Notepad in it.

The first talk was of @Frans Rosen, Security Advisor at Detectify, he gave a walkthrough on methodology and strategies to win big bounties. Here is a link to his [presentation](https://speakerdeck.com/fransrosen/live-hacking-like-a-mvh-a-walkthrough-on-methodology-and-strategies-to-win-big).

Some of the top Security Researchers and Security Engineers that included [Jack](https://twitter.com/fin1te)[Whitton](https://twitter.com/fin1te), [Maciej Szawłowsk](https://www.linkedin.com/in/maciej-szaw%C5%82owski-90b18951), [Yasin Soliman](https://twitter.com/securityyasin), Richard Neal, [Pranav Hivarekar](https://twitter.com/hivarekarpranav), [João Lucas Melo Brasio](https://twitter.com/whhackersbr), Mykola Babii, and [Michael Jezierny](https://www.linkedin.com/in/mjezierny/) also shared tips like chaining vulnerabilities to increase the impact and also gave some guidelines to pentest android application. The content of the talks was quite interesting, informative and gave a broad overview of the entire bug bounty process.

Top 4 CTF Winners, [Kishan Bagaria](https://twitter.com/kishanbagaria), [HoMing Tay](https://www.linkedin.com/in/homing-tay-538baa58), [Rahul Kankrale](https://twitter.com/rahulkankrale) and Sachin Thakur gave presentations on approaches they used to find the hidden flags across both the platforms. I recommend checking out the writeup of BountyCon flags by my friend, [Kishan](https://twitter.com/kishanbagaria), here is a link to his [writeup](https://kishanbagaria.com/bountycon/).

The long first day ended with a good dinner at Cook &amp; Brew at The Westin Hotel.

## Second Day of BountyCon

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;On the second day of BountyCon, Facebook kicked off with a live hacking event where researchers were challenged to report security bugs across both Facebook and Google. On that day, researchers from various APAC regions and few top researchers from Hackerone had submitted 40 bugs in total and Facebook awarded over $120k for valid submissions. The top three researchers with maximum points were [Dzmitry Lukyanenka](https://twitter.com/xdzmitry), [Shubham Shah](https://twitter.com/infosec_au) and [Anbu Selvam Mercy](https://twitter.com/Im_AnbuSelvam). After the award ceremony, the event was wrapped up with an amazing dinner at Nude Grills and a few drinks.

Overall it was a worthy learning experience and I would like to thank **Facebook** and **Google** for their effort in organizing this event.

Here are some of the photos that we took in Singapore and BountyCon:

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/bountycon_1.png" style="box-shadow: 1px 1px 10px 1px #222; width: 700px; height: auto;">
  <div style="text-align:center;margin-top:5px;">
  	Picture Courtesy: <a href="https://twitter.com/rraahhuullk">@rraahhuullk</a>
  </div>
</div>

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/bountycon_2.png" style="box-shadow: 1px 1px 10px 1px #222; width: 700px; height: auto;">
  <div style="text-align:center;margin-top:5px;">
  	Picture Courtesy: <a href="https://twitter.com/GoogleVRP">@GoogleVRP</a>
  </div>
</div>

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/bountycon_3.png" style="box-shadow: 1px 1px 10px 1px #222; width: 700px; height: auto;">
  <div style="text-align:center;margin-top:5px;">
  	Picture Courtesy: <a href="https://twitter.com/ajdumanhug">@ajdumanhug</a>
  </div>
</div>

<div style="text-align:center;margin:50px">
  <img src="/images/2019/12/bountycon_4.png" style="box-shadow: 1px 1px 10px 1px #222; width: 700px; height: auto;">
  <div style="text-align:center;margin-top:5px;">
  	Picture Courtesy: <a href="https://twitter.com/InfoSecJon">@InfoSecJon</a>
  </div>
</div>
