---
layout: post
title: "Cypress - A worthy replacement for Protractor?"
excerpt: "Cypress - A worthy replacement for Protractor?"
authorslug: kandeel_chauhan
author: Kandeel Chauhan
---
<div style="text-align:center; margin: 10px; display: none">
  <img src="/images/2022/12/qaWingify.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

We, at Wingify, have implemented our web automation tests using Protractor. Although the old horse has served us well it is fast approaching it's end of life. And so, the hunt for a worthy successor begins. In this article, we will talk about what we love about Cypress, the drawbacks, trade-offs, and dealbreakers(if any). 

## Part1- The honeymoon!

Having spent a week and a half exploring Cypress as a potential replacement to Protractor, we found a lot of things we like about it.

# Debugging with Cypress is a cakewalk: 
Contrary to what we read in certain blogs, we like debugging features in Cypress. While some dislike the constraint of “no logs in Visual Studio Code”, we feel there is a lot to like in the Cypress "Test Runner".
* Mapping of logs and snapshots with each step of the script in test runner is easy to follow.
* Breakpoints can be added with cy.pause() and we can continue debugging in the test runner.
* And best of all, we can view browser console/network tabs in the test runner itself which makes debugging immensely convenient.
* Also worth a mention - Option for recording the test runs into a video, and the fact that it can be run in 'headed' mode even through CLI when the need arises.

# Runs directly on the Browser(no web driver):
 This brings some unique and awesome abilities to Cypress over tools that use WebDriver.
* Cypress can be used for stubbing network calls - This can enable us to test multiple scenarios without having to create test data for each test.
* Can manipulate DOM - this gives us abilities to work around some of the "trade-offs" - Will talk more about this in the next article where we discuss the drawbacks of Cypress.

# Stable Tests:
 	There are various Cypress features that help make your test execution more stable while some help in writing cleaner code. Below are the points we observed:
* Automatically waits for non-intractable elements - works mostly in case of browser loads or if the application front end has a hint for Cypress to identify such as a loader. I read in a blog that Cypress interacts with hidden elements(eg. behind an open Dropdown), but in our observation, we had to use (click({force: true}), which is more like js executor.
* Promises are resolved automatically: fine print ahead :). Promises are handled for Cypress commands and assertions from chai/mocha. Others need to be handled programmatically. Cypress also allows you to create custom Cypress commands, and overwrite existing commands. We tried to create a custom Cypress command to getProperty using the jquery function prop(), but to our disappointment, we still had to resolve the promise :(. cy.wrap() is also worth a mention and can help in writing cleaner code. 


# Other smaller 'wins' for Cypress:
* Cypress can handle iframes: As opposed to what is mentioned in some of the older blogs on the internet, newer versions of Cypress handle iframes. The plugin 'Cypress-iframe' can be used for this purpose. However, we observed no screenshots for iframes yet in the test runner.
* Cypress provides a blueprint of a framework to its users which is a boon for beginners.

All in all, Cypress seems to be a robust tool, and spending just a few hours with it one can see why it is so widely accepted. Read on to the next section where we explore the limitations of the tool. And whether or not we, at Wingify, finalize it as our web automation tool.


## Part-2 – The Heartbreak!
Alas! Some things are just not meant to be!  Some of the limitations in Cypress meant that we could not go ahead with the tool as our replacement for Protractor. Cypress official documentation lists these as ‘trade-offs’ between capability and stability.

# Cross-Domain Flows: 
Cypress does not allow you to visit two domains of different origins in the same test case. Unfortunately, we have specific use cases where our scripts need to perform these kinds of tests. This turned out to be a deal-breaker for us.


# Multiple Tabs / Multiple Windows:
 As discussed earlier in this article, Cypress runs directly on the browser and hence can not support multiple windows or tabs. While some simple HTML implementations (target _blank) can be manipulated by Cypress to open in the same tab, it does not work for more complex implementations where the logic is driven by front-end code.  
   	
While there are other limitations that Cypress has, we talk about just these two as they are the deal breakers for us. If these limitations do not block any of the use cases in your case - Thats great but do take a look at the other issues here: [Cypress Trade-Offs](https://docs.cypress.io/guides/references/trade-offs#Permanent-trade-offs-1) before you make a final decision.

As our hunt for a new Automation tool continues, we now turn our gaze towards Playwright. Only time will tell if this is the tool that finally mends our broken heart :) 