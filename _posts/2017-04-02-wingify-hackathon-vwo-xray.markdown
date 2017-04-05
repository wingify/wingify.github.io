---
layout: post
title: "Wingify Hackathon - VWO X-Ray"
excerpt: Wingify Hackathon - VWO X-Ray
authorslug: hemkaran_raghav
author: Hemkaran Raghav
---

Whether it's daily work or any other competition or hackathon, Wingifighters always choose to give their best. Recently, Wingify had organised 24 hours [Internal Hackathon](https://medium.com/@wingify/hacking-away-the-night-at-wingify-cbe33a39f28d) where developers from Wingify created lot of awesome projects for the daily use. The theme was "Solve Daily Problems". Be it a generic problem or an internal team problem, Hackers from Wingify tried to solve many problems over the night. So, I along with [Pramod Dutta](https://www.linkedin.com/in/pramoddutta/) created a chrome extension "VWO X-Ray" (One of the Winners), which is very helpful for our internal team.

VWO X-Ray was created to easily debug the VWO smart code on a website. Whether it is a Developer or a Customer Happiness Engineer or a Client, they need some basic information about VWO running on a particular page. This chrome extension enables the user to view account id on the page, running VWO campaigns and cookies created by VWO. The basic features of the extension are:

1. View account ID on the page and impersonate into it directly.
2. <i>Home Tab</i> will show all campaigns on the page and their information like is campaign running, segmentation passed.
3. Directly open a specific campaign in single click into the VWO app.
4. Directly copy the "Share report link" of the campaign and share it with anyone.
5. View VWO cookies information in detailed and clear view.
6. Notification feature when any campaign variation is applied on the page or any goal has been triggered.
7. <i>Full Data Tab</i> will give you a glimpse of app dashboard. You can change account id to get any other account's data.
8. <i>Session Data Tab</i> will show current session information (Track and Analyse), various campaigns data and Goal data (which are triggered and which are not).
9. <i>Impersonate Tab</i> will enable you to impersonate into any account and campaign directly. Just enter Account id and Campaign id (optional).
10. This extension by default makes 100% sampling rate for Track and Analyse campaigns (most wanted feature for our QA and Customer Happiness Engineers team).

We are running VWO X-Ray on our [vwo.com](http://vwo.com) website. Here is the screenshot of extension on the website:

<div style="text-align:center; margin: 10px;">
  <img src="/images/2017/04/vwo_xray_1.png" style="box-shadow: 1px 2px 10px 1px #aaa">
  <div style="margin: 10px;">This is showing various campaigns running on the page and their status</div>
</div>

<br/>
<div style="text-align:center; margin: 10px;">
  <img src="/images/2017/04/vwo_xray_2.png" style="box-shadow: 1px 2px 10px 1px #aaa">
  <div style="margin: 10px;">Session data information in clear view</div>
</div>

We are shortly releasing it to our clients also so that they can get basic information using this extension only.

Here is the demo of VWO X-Ray:
<div style="text-align:center; margin: 10px;" style="box-shadow: 1px 2px 10px 1px #aaa">
  <img src="/images/2017/04/vwo_xray_3.gif">
</div>