---
layout: post
title: "Automating Web Push Notifications @Selenium Conference 2016"
excerpt: This post describes our experience at Selenium Conference 2016 and introducing web push notifications automation
authorslug: jatin_makhija_ankita_gupta
author: Jatin Makhija, Ankita Gupta
---




# Selenium Conference 2016- A talk delivered, live demo executed, audience???
_Stunned._

2 hrs left to catch a flight for an exciting opportunity to present at the biggest selenium conference, SeleniumConf 2016, we were still waiting for our cab. Yes, he was lost within 800 meters of our [Wingify][1] office! Finally we boarded the flight at *Final Call*.

<img src="/images/2016/08/pushknot_final_call.png">

Cool breeze welcomed us at Bengaluru airport and next morning we were at The Chancery Pavillion Hotel with our passes.

<img src="/images/2016/08/badges_selenium_conf_2016.jpg">

First half of Day 1 was mostly about keynotes, logistics and sponsor stands. HP launches lean UFT, introducing Selenium inside their tool. Woot! No more hassles of page objects, inspect and use their object repository.

### D day:: Demo day

There was no hurry to reach the venue today as the streets were all mapped a day before, suits and boots were tied up. It was the day to present, World's first ever open source automation tool for push notifications - _PushKnot_

Push notifications allow users to opt-in to timely updates from sites they love and allow you to effectively re-engage them with customized, engaging content.
As per recent surveys, push notifications are turning out to be better than email notifications.

Since it's a relatively new technology which is booming, the SDLC flows goes like this specs written, functionality developed, unit tests written.. How about testing it end to end?
Do it manually or automate it like a boss!

PushKnot helps you do the latter part well.

<img src="/images/2016/08/pushknot_logo.png">


> "PushKnot is a specialized open-source proxy tool for modifying, parsing and fetching desktop push notifications.”

#### How PushKnot works:

It works as a proxy server which intercepts the service-worker registration request’s response. It adds a specific payload and the new modified service-worker is registered with the browser.

<img src="/images/2016/08/pushknot_first_diagram.jpg">

Now this payload, has specialized code which intercepts and captures the push notification received. Once it has intercepted the push notifications, it saves the notification data in JSON format in a file, and forwards the notification back to the browser so that it can be seen there.

<img src="/images/2016/08/pushknot_second_diagram.jpg">

Once the response is stored in a JSON file it can be easily read and verified.

<img src="/images/2016/08/sample_json.png">

__Steps:__

1.   The service is available at https://github.com/Ankitagupta2309/

2.   After cloning the repo, you can start it by running

	node start.js —domain=<youdomain>

Note: PushKnot will only proxy requests belonging to the domain specified. It will not interfere with other requests. Hence specifying it is important.

3.   By default it will run on port 9002, if you want to change it you can do so by using the flag —port=9003

4.   Set up __https__ system proxy to point to 127.0.0.1:9002

<img src="/images/2016/08/setup_proxy_push.png">

5. When you are launching your browser you need to set 2 flags:
..* Start a chrome browser with --ignore-certificate-errors flag
..* Set browser preference 'profile.default_content_setting_values.notifications': 1


````json
chromeOptions: {
	'args': ['--ignore-certificate-errors'],
	prefs: {
		'profile.default_content_setting_values.notifications': 1
	}
}
````



[Slides deck][2] from the talk:

<div style="width: 100%">
<iframe src="//www.slideshare.net/slideshow/embed_code/key/jinpOBbAaNDv54" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/ankitagupta2309/pushknot" title="Pushknot" target="_blank">Pushknot</a> <a target="_blank" href="//www.slideshare.net/ankitagupta2309"></a></strong> </div>
</div>


  [1]: https://wingify.com/
  [2]: http:///www.slideshare.net/ankitagupta2309/pushknot
