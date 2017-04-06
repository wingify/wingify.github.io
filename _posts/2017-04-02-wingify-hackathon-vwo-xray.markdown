---
layout: post
title: "Wingify Hackathon - VWO X-Ray"
excerpt: Wingify Hackathon - VWO X-Ray
authorslug: hemkaran_raghav
author: Hemkaran Raghav
---

Recently, Wingify had organised a 24-hour [Internal Hackathon](https://medium.com/@wingify/hacking-away-the-night-at-wingify-cbe33a39f28d) where the developers from Wingify created a lot of awesome projects for daily use. The theme was <i><b>"Solve Daily Problems"</b></i>. Be it a generic problem or an internal team problem, hackers from Wingify tried to solve many problems over the night. So, [Pramod Dutta](https://www.linkedin.com/in/pramoddutta/) and I created a Google Chrome extension <b>"VWO X-Ray"</b> (<i>one of the winners</i>), which has proved to be helpful to our internal team.

VWO X-Ray was created to easily debug the VWO smart code on a website. Whether it's a developer or a Customer Happiness Engineer or a client, they need some basic information about VWO running on a particular page. This Google Chrome extension enables the user to view the account ID, the running VWO campaigns and the cookies created by VWO on that page. The basic features of the extension are:

1. View account ID on the page and impersonate into it directly.
2. The <i>Home Tab</i> will show all campaigns on the page and their information like whether campaigns are running, segmentations passed etc.
3. Directly open a specific campaign, with a single click, into the VWO app.
4. Directly copy the "Share report link" of the campaign and share it with anyone.
5. View VWO cookies' information in a detailed and clear view.
6. Notification feature when any campaign variation is applied on the page or any goal has been triggered.
7. The <i>Full Data Tab</i> will give you a glimpse of the app dashboard. You can change the account ID to get any other account's data.
8. The <i>Session Data Tab</i> will show current session's information (Track and Analyse), various campaigns' data and goals' data (which ones have been triggered and which ones have not been).
9. The <i>Impersonate Tab</i> will enable you to impersonate into any account and campaign directly. Just enter the account ID and campaign ID(optional).
10. This extension, by default, makes 100% sampling rate for Track and Analyse campaigns (most wanted feature by our QA team and Customer Happiness Engineers team).

Here are some screenshots of the VWO X-Ray extension running on our [vwo.com](http://vwo.com) website:

<div style="text-align:center; margin: 10px;">
  <img src="/images/2017/04/vwo_xray_1.png" style="box-shadow: 1px 2px 10px 1px #aaa">
  <div style="margin: 10px;">The various campaigns running on the page and their statuses</div>
</div>

<br/>
<div style="text-align:center; margin: 10px;">
  <img src="/images/2017/04/vwo_xray_2.png" style="box-shadow: 1px 2px 10px 1px #aaa">
  <div style="margin: 10px;">A clear view of the session data information</div>
</div>

We will also be shortly releasing this to our clients, so that they too can get basic information just by using the extension.

Here is the demo of VWO X-Ray:
<div style="text-align:center; margin: 10px;" style="box-shadow: 1px 2px 10px 1px #aaa">
  <img src="/images/2017/04/vwo_xray_3.gif">
</div>