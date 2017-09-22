---
layout: post
title: "Wingify's First Internal CTF"
excerpt: Wingify Capture The Flag Event.
authorslug: dheeraj_joshi
author: Dheeraj Joshi
---

<p style="text-align: center;">
    <img src="/images/2017/05/ctf_logo.png">
</p>
Have you ever seen a bunch of geeks lock themselves up in a room, hacking throughout the day? This was witnessed when Wingify had its very first Capture The Flag battle.

Capture the Flag (CTF) is a special kind of information security competition which provides a safe and legal way to try your hand at hacking challenges. 
We have learned a lot of computer science and security concepts in classes, and by reading articles. But participating in a CTF actually teaches how to break into things when they are not implemented properly, which happens all the time in the real world. In this, all you need to do is to find a flag which is a proof that you solved the puzzle, and submitting it to the platform earns your team points. Flags are typically chosen to look very distinctive, so that when you see one, you’ll know that it’s a flag, and that you’ve solved the puzzle. For example, `flag{congr4tz_y0u_found_1t}`.


<p style="text-align: center; margin: 10px;">
    <img style="width: 80%;" src="/images/2017/05/ctf_pic.jpg">
</p>

### Preparation
Sometime back, [Facebook open-sourced a platform][1] to host [Jeopardy styled CTF competitions][2] and we couldn't resist ourselves from using it. It's simply amazing and sleek. It took around 2-3 weeks to prepare for the event and we had fun brainstorming creating the problem set. Creating the problems required thinking of some real world scenarios from the field of software development and security and combine them with references like Mr. Robot, Snowden, etc. A few ideas were taken from prior experience participating in online CTFs and [Wargames][17].


### Event
Wingify CTF was an internal event and very first of its type. Bonus points were offered for teaming up with someone from a non-engineering role. We saw some great participation from the customer support, customer success & marketing teams as well. To bring everyone on the same page, participants were asked to register for the event by solving a teaser. And the teaser was to find a flag in a registration form. You'd be surprised to hear that the form was made using Google Forms 😮.

It was an 8-hour long online event which had 45 participants among 16 teams. There was a total of 12 challenges ranging between 40 and 400 based on the difficulty level with total available 1840 points. The set of challenges included problems in web application security and forensics. There was another teaser to be solved before starting off the real game. Early in the CTF, everyone was doing pretty well especially team Matrix and Hunters. In half of the time, quite a good number of hackers were already done with all the problems except the two most difficult ones. When the team Rootcon and Hustlers solved the challenge worth 400 points, they were the clear winners on everyone's mind. But as they say, it's not over till it's over. At the last-minute when team RSS captured that big flag and stood the first place, it was the same feeling like a dramatic last-minute goal in Football.👏



### Challenges
I'd like to mention some of the interesting challenges.

1. **XSS** - When we talk about Frontend security, cross-site scripting is the first vulnerability that comes to everyone's mind. One of the challenges was to detect an XSS vulnerability and exploit it by stealing the cookies. The key challenge while creating this problem was using PhantomJS, a headless WebKit, to check whether the XSS payload got successfully triggered. `shell_exec('phantomjs fake-browser.js --url' . $url . ' --password ' . getenv('FLAG'));`

2. **S3 Secrets/Credentials** - This problem was based on the fact that the credentials, such as Amazon S3 keys, Github tokens, and passwords, are [often included in published GitHub repositories][19]. Once you have put sensitive data in a Git repository, it is going to stay in the repo's history forever ([there are ways to avoid this][18]).

3. **Encryption** - One of my personal favorites was the problem requiring teams to calculate the MD5 of a given string. Sounds pretty straight, right? The challenge is right here in front of you<!-- Not here 😉 -->. Can you capture the flag and send it to ctf@wingify.com? 😊

### Winners

<p style="text-align: center;">
    <img style="width: 85%;" src="/images/2017/05/ctf_result.png">
</p>

1. **Team RSS** - [Rachit Gulati][7], [Sahil Batla][8], and [Sandeep Singh][9]

2. **Team ROOTCON** - [Gaurav Nanda][10], [Aakansh Gulati][11], and [Ankita Gupta][12]

3. **Team HUSTLERS** - [Rahul Kumar][13], [Arun Sori][14], and [Dinkar Pundir][15]

Each participant from the top two teams was given [Yubikey][16] and Bluetooth Speaker respectively.


[Chhavi][6] and I were able to pull off the event successfully. It turned out to be great and everyone had fun hacking together. I would highly recommend doing something like this for your organization.  This will surely increase the breadth of security knowledge.

### Mini CTF (External)
Last week, Wingify hosted a [PyData Meetup][3] and attendees played a quick round of CTF. You can find the pictures below.

<script>Galleria.run('#fifth-elephant-gallery');</script>
<div id="fifth-elephant-gallery" style="height: 600px;">
    <img src="/images/2017/05/ctf_meetup.jpg">
    <img src="/images/2017/05/ctf_meetup2.jpg">
    <img src="/images/2017/05/ctf_meetup3.jpg">
    <img src="/images/2017/05/ctf_scoreboard.JPG">
    <img src="/images/2017/05/ctf_prize1.jpg">
    <img src="/images/2017/05/ctf_prize2.jpg">
</div>

If you would like to practice for such events, you should definitely participate in the online CTFs. You can find the [list of long-running CTFs][4]. And if you like playing CTFs, we are hiring for [Security Engineer position][5] 😍 🙂.

  [1]: https://github.com/facebook/fbctf
  [2]: https://ctftime.org/ctf-wtf/
  [3]: https://meetup.com/PyDataDelhi/events/239902014/
  [4]: http://captf.com/practice-ctf/
  [5]: https://wingify.recruiterbox.com/jobs/fk0m8cr/
  [6]: https://in.linkedin.com/in/chhavi-khandelwal-4587513b
  [7]: https://twitter.com/squiroid
  [8]: https://in.linkedin.com/in/sahil-bathla-11a7815b
  [9]: https://in.linkedin.com/in/sndpsngh
  [10]: https://twitter.com/gauravmuk
  [11]: https://twitter.com/akanshgulati
  [12]: https://twitter.com/_ankitag_
  [13]: https://in.linkedin.com/in/rahul-kumar-5676a020
  [14]: https://twitter.com/arunsori
  [15]: https://twitter.com/dinkarpundir
  [16]: https://en.wikipedia.org/wiki/YubiKey
  [17]: http://overthewire.org/wargames/
  [18]: https://help.github.com/articles/removing-sensitive-data-from-a-repository/
  [19]: https://news.ycombinator.com/item?id=13650818
