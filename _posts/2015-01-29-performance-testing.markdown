---
layout: post
title: Overcoming the Challenges of Performance Testing Single-page Apps
excerpt: This post describes ways to performance test ajax/javascript enabled application.
authorslug: rahul_jain
author: Rahul Jain
---
To begin with, lets talk about two of the most important things are that come to mind when we talk about performance testing.

### The Metrics to Measure

First lets consider the metrics to measure. Few important metrics that should always be considered are:

1. Response time which could include Javascript file load time, Image load time, CSS file load time, Content Download time etc.

2. Number of HTTP Request and HTTP Response status.

### Dependencies

Coming to second part i.e. Dependencies. Now this could be broadly classified by 2 groups: 

1. Client-side testing
2. Server-side (API level) testing

Most of the people focus on testing their servers and APIs. But server-side testing is not enough these days, as its hard to find applications which do not use Javascript/Ajax today.

In single-page apps, the performance equally depends on both the client-side and the server-side. 

Since single-page apps are Javascript/Ajax enabled, measuring performance from server/API level is not enough. Even poorly written javascript code can majorly affect the performance of the app.

Client-side performance testing can also be done using popular tools like [Google Page Speed](https://developers.google.com/speed/pagespeed/) or [Webpagetest.org](http://webpagetest.org). But they cannot test different modules of the application seperately. They'd just test the URLs you enter. To test different sections of your application, we can follow a different appraoch. 

In this blog post, I’m going to show you how to use the most popular open-source tool (JMeter)[http://jmeter.apache.org/] to performance test AJAX-enabled websites.

## Challenges

A well-known limitation of JMeter is that it isn't a browser i.e its inability to execute Javascript. This and that when JMeter makes a request to a page, AJAX calls are not automatically executed. JMeter does store Javascript requests when recorded but this is done as individual sampler.

Now to overcome this challenge we have a few options we can work on:

1. Use WebDriver Sampler to measure the response time in a real time browser. Combining this with JMeter load test, we can measure the real time user experience when we apply severe load.

2. Use JUnit Sampler to create selenium scripts using tools like Eclipse. Using this approach one can export JAR fie to JMeter and run the test in browser.

3. Simulate an Ajax request using JSR223 sampler.

Lets talk in further detail about these methods to performance test.

### Using JMeter WebDriver Sampler with Selenium

Web Driver Sampler automates the execution and collection of Performance metrics on the Browser (client-side). You can download this plugin from the link shared below.

A large part of performance testing, up to this point, has been on the server side of things. However, with the advancement of technology, HTML5, JS and CSS improvements, more and more logic and behaviour have been pushed down to the client. This adds to the overall perceived performance of website/webapp, but this metric is not available in JMeter.

Simply add the following to your test plan:

1. Firefox Driver Config
2. Web Driver Sampler
3. View Results Table

![](/images/2015/01/01.png)

Now add the following Javacript code in WebDriver Sampler

{% highlight js %}
WDS.sampleResult.sampleStart();
WDS.browser.get('http://wingify.com');
WDS.sampleResult.sampleEnd();
{% endhighlight %}

The only problem with approach is that the automation capability is limited. But again that depends on the application. 

For more info, visit [http://jmeter-plugins.org/wiki/WebDriverTutorial/](http://jmeter-plugins.org/wiki/WebDriverTutorial/)

### Using JUnit Sampler

Using this method all we need to do is create a JAR file using Eclipse and export it to JMeter. 

**Creating JAR using Eclipse**

1. Create a JUnit Test case in your project.

2. Write the following selenium code to open your homepage.

{% highlight java %}
package wing;

import static org.junit.Assert.*;

import java.net.MalformedURLException;
import java.net.URL;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

public class home {

	@Test
	public void test() throws MalformedURLException {
		WebDriver driver2 = new RemoteWebDriver(new URL("http://22.222.122.22:4444/wd/hub"),DesiredCapabilities.firefox());
		 driver2.get("http://wingify.com");
		 System.out.println(driver2.getTitle());
		 driver2.quit();
		
	}

}
{% endhighlight %}

**Note**: In the above code we are using RemoteWebDriver to open the browser on a different machine since we will integrate our test with jenkins.

Once this is done you just need to export the JUnit test case to JMeter. Just copy the JAR file into JMeter/extras/JUnit folder and restart JMeter. 

After this just click on "Search for JUnit 4 annotations" in case you created a JUnit 4 test case and you ll find the JAR file with class name in drop down.

![](/images/2015/01/02.png)

### Simulate an Ajax request using JSR223 sampler

Normally this method is not recommended. But if above solutions don't work well with your system you can go for Beanshell and use any scripting language like groovy to create Ajax request.

## Conclusion

Below are some points to keep in mind while creating performance test plan:

1. Create custom scripts for different use cases and create a threshold for various metrics.
2. You can also use headless browser testing using **HtmlUnitDriver** or **Xvfb** depending on your system. This approach would work well if you need to combine these with your load test.
3. You can integrate your tests with **Jenkins** using the **performance plugin**. It really helps with reporting and you can simply run it with each new build. In fact, that is also how we do it here at Wingify.
4. Client-Side performance testing is always done using 1 or 2 threads. But if you need to use it with your load test then you can simulate as many threads as you wish to.

There's a lot more exciting stuff you can do to handle Javascript/Ajax enabled applications. This is just a brief summary of the work we do here at [Wingify](http://wingify.com). Hope this helps you get started. There can be many ways you can achieve amazing results. If you have any questions/comments, or create something awesome, we will be more than happy to hear from you. 
