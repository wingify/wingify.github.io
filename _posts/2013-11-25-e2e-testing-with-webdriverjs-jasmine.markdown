---
layout: post
title: Automated e2e testing: WebDriverJS, Jasmine and Protractor
excerpt: Automated e2e testing: WebDriverJS, Jasmine and Protractor
authorslug: kushagra_gour
author: Kushagra Gour
---

e2e or end-to-end or UI testing is a methodology used to test whether the flow of an application is performing as designed from start to finish. In simple words, it is testing of your application from the user endpoint where the whole system is a blackbox with only the UI exposed to the user.

It can become quite an overhead if done manually and if your application has a large number of interactions/pages to test.

In the rest of the article I'll talk about webdriverJS and Jasmine to automate your e2e testing, a combination which isn't talked about much on the web.

## What is WebDriverJS?

This was something which took me quite sometime to put my head around and I feel this was more or less due to the various available options for everything related to WebDriver.

So let's take it from the top and see what its all about.

### Selenium

As mentioned on the [selenium website](http://www.seleniumhq.org/), Selenium automates browsers. That's it.

This having support for almost all major browsers, is a very good alternative to automate our tests in the browser.
So whatever you do in the browser while testing your application, like navigating to pages, clicking a button, writing text in input boxes, submitting forms etc, can be automated using Selenium.

### WebDriver

WebDriver (or Selenium 2) basically refers to the language bindings and the implementations of the individual browser controlling code.

WebDriver introduces a [JSON wire protocol](https://code.google.com/p/selenium/wiki/JsonWireProtocol) for various language bindings to communicate with the browser controller.

For example, to click an element in the browser, the binding will send POST request on `/session/:sessionId/element/:id/click`

So, at one end there is the language binding and a server, known as Selenium server, on the other. Both communicate using the JSON wire protocol.

### WebDriverJS

As mentioned, WebDriver has a number of bindings for various languages like Ruby, Python etc. JavaScript being the language of choice for the web, is the latest one to make it to the list. Enter [WebDriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs)!

So as you might guess, WebDriverJS is simply a wrapper over the JSON wire protocol exposing high level functions to make our life easy.

Now if you search **webdriver JS** on the web, you'll come across 2 different bindings namely [*selenium-webdriver*](https://code.google.com/p/selenium/wiki/WebDriverJs) and [*webdriverjs*](https://github.com/camme/webdriverjs) (yeah, lots of driver), both available as node modules. You can use anyone you like, though we'll stick to the official one i.e. *selenium-webdriver*.

Say you have a JavaScript project you want to automate e2e testing on. Installing the bindings is as simple as doing:

```
npm install selenium-webdriver
```

Done! You can now require the package and with a lil' configuration you can open any webpage in the browser:

```
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

driver.get('http://www.wingify.com');
```

To run your test file, all you do is:

```
node testfile.js
```

**Note**: In addition to the npm package, you will need to download the WebDriver implementations you wish to utilize. As of 2.34.0, selenium-webdriver natively supports the [ChromeDriver](https://code.google.com/p/selenium/wiki/ChromeDriver). Simply [download a copy](http://chromedriver.storage.googleapis.com/index.html) and make sure it can be found on your PATH. The other drivers (e.g. Firefox, Internet Explorer, and Safari), still require the [standalone Selenium server](http://selenium.googlecode.com/files/selenium-server-standalone-2.37.0.jar).

### Difference from other language bindings

WebDriverJS has an important difference from other bindings in any other language - **It is asynchronous**.

So if you had done the following in python:
```
// pseudo code
driver.get(page1);
driver.click(E1);
```

Both statments would have executed synchronously as the Python (as every other language) API is blocking. But that isn't the case with JavaScript. To maintain the required sequence between various actions, WebDriverJS uses [Promises](https://code.google.com/p/selenium/source/browse/javascript/webdriver/promise.js). In short, a promise is an object that can execute whatever you give it after it has finished.

But it doesn't stop here. Even with promises, the above code would have become:

```
// pseudo code
driver.get(page1).then(function () {
	driver.click(E1);
});
```

Do you smell callback hell in there? To make it more neat, WebDriverJS has a wrapper for Promise called as [**ControlFlow**](https://code.google.com/p/selenium/wiki/WebDriverJs#Control_Flows).

In simple words, this is how *ControlFlow* prevents callback hell:

- It maintains a list of schedule actions.
- The exposed functions in WebDriverJS do not actually do their stuff, instead they just push the required action into the above mentioned list.
- *ControlFlow* puts every new entry in the `then` callback of the last entry of the list, thus ensuring the sequence between them.

And so, it enables us to simply do:

```
// pseudo code
driver.get(page1);
// Implicitly add to previous action's then()
driver.click(E1);
```

Isn't that awesome!

*Controlflow* also provides an `execute` function to push your custom function inside the execution list and the return value of that function is used to resolve/reject that particular execution. So you can use promises and do any asynchronous thing in your custom code:

```
var flow = webdriver.promise.controlFlow();

flow.execute(function () {
	var d = webdriver.promise.defer();
	do_anything_async().then(function (val) {
		d.fulfill(val);
	})
	return d.promise;
});
```

**Quick tip**: Documentation for JavaScript bindings isn't that readily available (atleast I couldn't find it), so the best thing I found to be useful was the actual [WebDriverJS code](https://code.google.com/p/selenium/source/browse/javascript/webdriver/). It heavily commented and is very handy while looking for specific methods on the driver.

## Combining WebDriverJS with Jasmine

Our browser automation is setup with selenium. Now we need a testing framework to handle our tests. That is where [Jasmine](http://pivotal.github.io/jasmine/) comes in.

You can install jasmine for your JavaScript project through npm:
```
npm install jasmine-node
```

If we were to convert our earlier `testfile.js` to check for correct page title, here is what it might look like:


```
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

describe('basic test', function () {
	it('should be on correct page', function () {
		driver.get('http://www.wingify.com');
		driver.getTitle().then(function(title) {
			expect(title).toBe('Wingify');
		});
	});
});
```

Now the above file needs to be run with [jasmine-node](https://github.com/mhevery/jasmine-node), like so:

```
jasmine-node testfile.js
```

This will fire the browser and do the mentioned operations, but you'll notice that Jasmine won't give any results for the test. Why?

Well...that happens because Jasmine has finished executing and no `expect` statement ever executed because of the expectation being inside an asynchronous callback of `getTitle` function.

To solve such asynchronicity in our tests, jasmine-node provides a way to tell that a particular `it` block is asynchronous. It is done by accepting a done callback in the specification (`it` function) which makes Jasmine wait for the `done()` to be executed. So here is how we fix the above code:


```
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

describe('basic test', function () {
	it('should be on correct page', function (done) {
		driver.get('http://www.wingify.com');
		driver.getTitle().then(function(title) {
			expect(title).toBe('Wingify');
			// Jasmine waits for the done callback to be called before proceeding to next specification.
			done();
		});
	});
});
```
**Quick tip**: You might want to tweak the time allowed for tests to complete in Jasmine like so:

```
jasmine.getEnv().defaultTimeoutInterval = 10000; // in microseconds.
```

## Bonus for Angular apps

Angular framework has been very testing focused since the very beginning. Needless to say, they have devoted a lot of time on e2e testing as well.

[Protractor](https://github.com/angular/protractor) is a library by the Angular team which is a wrapper on WebDriverJS and Jasmine and is specifically tailored to make testing of Angular apps a breeze.

Checkout some of the neat addons it gives you:

1. Apart from querying element based on id, css selector, xpath etc, it lets you query on basis of binding, model, repeater etc. Sweat!

2. It has Jasmine's `expect` function patched to accept promises. So, for example, in our previous test where we were checking for title:

```
driver.getTitle().then(function (title) {
	expect(title).toBe('Wingify');
});
```

can be refactored to a much cleaner:

```
expect(driver.getTitle()).toBe('Wingify');
```

And more such cool stuff to make end-to-end testing for Angular apps super-easy.

## In the end

e2e testing is important for the apps being written today and hence it becomes important for it to be automated and at the same time fun and easy to perform. There are numerous tools available for you to choose and this article talks about one such tool combination.

Hope this helps you get started. So what are you waiting for, lets write some end-to-end tests!

## Links & references

- WebDriverJS user guide: [https://code.google.com/p/selenium/wiki/WebDriverJs](https://code.google.com/p/selenium/wiki/WebDriverJs)

- WebDriverJS source: [https://code.google.com/p/selenium/source/browse/javascript/webdriver/](https://code.google.com/p/selenium/source/browse/javascript/webdriver/)

- JSON wire protocol: [https://code.google.com/p/selenium/wiki/JsonWireProtocol](https://code.google.com/p/selenium/wiki/JsonWireProtocol)

- Jasmine: [http://pivotal.github.io/jasmine/](http://pivotal.github.io/jasmine/)

- jasmine-node: [https://github.com/mhevery/jasmine-node](https://github.com/mhevery/jasmine-node)

- Protractor: [https://github.com/angular/protractor](https://github.com/angular/protractor)
