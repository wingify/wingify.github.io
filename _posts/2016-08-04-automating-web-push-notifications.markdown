---
layout: post
title: "Automating Web Push Notifications @Selenium Conference 2016"
excerpt: This post describes our experience at Selenium Conference 2016 and introducing web push notifications automation
authorslug: jatin_makhija_ankita_gupta
author: Jatin Makhija, Ankita Gupta
---



There were just two hours left to catch a flight for an exciting opportunity to present at the biggest Selenium conference, SeleniumConf 2016, and we were still waiting for our cab to the airport. Our driver was lost within 350 meters of our [Wingify][1] office, finding his way around the vicinity. Eventually, we boarded the flight at the *final call*!

<img src="/images/2016/08/pushknot_final_call.png">

A cool breeze welcomed us at Bengaluru airport, and the next morning we were at The Chancery Pavillion Hotel with our passes:

<img style="width:280px !important" src="/images/2016/08/badges_humans.jpg">

Day 1 was about keynotes, new tools and sponsor stands. HP launches lean UFT, introducing Selenium inbuilt with the tool. There were a lot of talks that explored more areas Selenium could be used in, thereby widening its scope.

### D day: Demo day

There was no hurry to reach the venue today as the streets were all mapped a day before, suits and boots were tied up. It was the day to present, world's first ever open source automation tool for push notifications - _PushKnot_

Push notifications let users to opt into timely updates from sites they love and allow you to effectively re-engage them with customized, engaging content.
As per recent surveys, push notifications are turning out to be better than email notifications.

Since it's a relatively new technology which is booming, the SDLC flows goes like this specs written, functionality developed, unit tests written, how about testing it end to end?
Do it manually or automate it like a boss!

__PushKnot__ helps you do the latter part well.

<img src="/images/2016/08/pushknot_logo.png">


> "PushKnot is a specialized open-source proxy tool for modifying, parsing and fetching desktop push notifications.”

#### How PushKnot works:

It works as a proxy server which intercepts the service-worker registration request’s response. It adds a specific payload and the new modified service-worker is registered with the browser.

<img src="/images/2016/08/pushknot_first_diagram.jpg">

This payload has specialized code which intercepts and captures the push notification received. Once it has intercepted the push notifications, it saves the notification data in JSON format in a file, and forwards the notification back to the browser so that it can be seen there.

<img src="/images/2016/08/pushknot_second_diagram.jpg">

Once the response is stored in a JSON file it can be easily read and verified.

<img src="/images/2016/08/sample_json.png">

__Steps:__

1.   The service is available at [https://github.com/Ankitagupta2309/pushKnot](https://github.com/Ankitagupta2309/pushKnot)

2.   After cloning the repo and running `npm install`, you can start it by running

        ````node start.js —domain=<yourdomain>
        ````

3.   By default it will run on port 9002, if you want to change it, you can do so by using the flag —port=9003

4.   Set up __https__ system proxy to point to 127.0.0.1:9002

     ![setup proxy push](/images/2016/08/setup_proxy_push.png)

5.   When you are launching your browser you need to set 2 flags:

     * Start a chrome browser with `--ignore-certificate-errors` flag
     * Set browser preference `'profile.default_content_setting_values.notifications': 1`


```javascript
chromeOptions: {
	'args': ['--ignore-certificate-errors'],
	prefs: {
		'profile.default_content_setting_values.notifications': 1
	}
}
```


<a href='http:///www.slideshare.net/ankitagupta2309/pushknot' target='_blank'>Slides deck</a> from the talk.

<div style="width: 100%">
<iframe src="//www.slideshare.net/slideshow/embed_code/key/jinpOBbAaNDv54" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
</div>

<a href='http://www.slideshare.net/ankitagupta2309/pushknot-demo' target='_blank'>Demo</a> from the talk.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/LsA1VDNjsPPfR0" width="595" height="335" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>


<a href='https://www.youtube.com/watch?v=Lj9HD-1Pikc' target='_blank'>Video</a> of the talk.

<iframe src="//www.youtube.com/embed/Lj9HD-1Pikc" width="595" height="335" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

It was a great learning experience. Received good feedback on our tool, some of which have already been implemented. Write back to us if you have any feedback or queries.

  [1]: https://wingify.com/
