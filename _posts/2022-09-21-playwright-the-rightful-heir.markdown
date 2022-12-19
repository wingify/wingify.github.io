---
layout: post
title: "Playwright – The Rightful Heir"
excerpt: "Playwright – The Rightful Heir"
authorslug: pratik_sisodia
author: Pratik Sisodia
---
<div style="text-align:center; margin: 10px; display: none">
  <img src="/images/2022/12/qaWingify.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

The hunt has ended. Protractor's successor has finally been found!

Introducing [Playwright](https://playwright.dev/), the new star of test automation:-). An end-to-end web browsers automation tool (since 2020), open-source and managed by Microsoft, by the Puppeteer team, that supports all current browsers including Google Chrome and Microsoft Edge via Chromium, Apple Safari via WebKit, and Mozilla Firefox. The article will discuss the reasons why we chose the Playwright, what we liked, and some limitations.

## **Why Playwright**

Playwright has all the capabilities of a competent test automation tool, such as [Cypress](https://engineering.wingify.com/posts/Cypress-a-worthy-replacement-for-protractor/) and Puppeteer, but none of the flakiness that comes with Selenium. It is compatible with major CI/CD servers. It supports a variety of programming languages, including TypeScript, JavaScript, Python,.NET, and Java, offering QAs more possibilities for writing test scripts. Additionally, it supports mobile emulation of both Google Chrome for Android and Mobile Safari

It offers a long list of features, but I would like to mention my personal favourite – **Auto-wait**. Playwright waits for elements to be actionable prior to performing actions. It also includes a variety of [events](https://playwright.dev/docs/events). The combination of the two removes the need for artificial timeouts, which are the root cause of flaky tests. When a Playwright test script is executed by a tester, the UI is prepared in the backend before the test interacts with web resources. Furthermore, if you're working on an Angular app like us, you may need to [polyfill protractor's waitForAngular](https://playwright.dev/docs/protractor#polyfilling-waitforangular) in some circumstances. We'd also need to add waits for the new window/pop-ups to load, as mentioned in the code below.

Additionally, below are some factors that helped us shortlist Playwright for our AUT at [Wingify](https://wingify.com/) -

1. It supports cross-domain testing, allowing you to visit two domains with different sources in the single test instance. The main disadvantage of Cypress is addressed.
2. It can handle scenarios involving multiple tab, shadow-dom, multiple iframes, file downloads and uploads. Everything works smoothly on Chrome.
3. The Window and Iframe handling is another plus, there is no notion of Window switching; in an open context, each page is a unique page and to access [newPage](https://playwright.dev/docs/pages#handling-new-pages) we can simply say

```tsx
const [newPage] = await Promise.all([
context.waitForEvent('page'),  
page.locator('a[target="_blank"]').click() *// Opens a new tab*
])
await newPage.waitForLoadState();
await newPage.locator('[id="new-window"]').click();
```  

4. For [Iframe](https://playwright.dev/docs/frames), we don't have to move to an iframe and then to default content to access an element in an iframe; instead, we just do

```tsx
newPage.frameLocator('[id="heatmap-iframe"]').locator('[id="heatmap-btn"]').click();
```  

5. Supports Selenium Grid, but only with Chromium.

6. We can easily include a beautiful [Allure HTML reporter](https://github.com/allure-framework) into your Playwright project. I'm sure you won't be disappointed if you try Playwright Test and Allure.

7. Playwright supports [Mock APIs](https://playwright.dev/docs/mock) as well as monitoring and modifying [network traffic](https://playwright.dev/docs/network). We will be using this in one of our projects and would discuss it in a future blog.


## **Other things we liked**

### **BrowserContext concept**

In Puppeteer and Protractor (WebDriverJS wrapper) you have Browsers and Pages. Each Page in a Browser has a common state across Browsers. So creating separate tests with one Browser (to avoid the inefficiency of creating one Browser for each test) requires special code to delete all cookies and local storage between tests. Playwright solves this problem with the [BrowserContext](https://playwright.dev/docs/browser-contexts) object, a new incognito window where its pages are created: each test can use the same browser but a different BrowserContext.

### **Retry with video**

Another feature I like about Playwright Test is the ability to retry with video option.  
You specify the following in your playwright.config.js file:

```tsx
module.exports = {  
use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retry-with-video'
  },
  retries: 1
}
```

When the video option is paired with the retry option, Playwright will re-run the test while shooting a video of the re-run.
If the test fails on the second attempt, the video will be saved in the test results (alongside the screenshot if you config it to capture screenshots also). It's a lightweight webm video that's easy to capture during CI and share.

### **Debugging with Playwright Inspector tool**

Next, let me demo the [Inspector](https://playwright.dev/docs/debug#playwright-inspector) tool by running the test using the following command.

```tsx
PWDEBUG=1 npx playwright test
```


<div style="text-align:center; margin: 10px;">
  <img src="/images/2022/04/debugger.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

This launches the inspector tool beside the browser window and awaits my click on the Resume button to proceed to the next phase. We may use the Inspector tool to debug each line of code and check how it works in real-time on the browser.

The 'Explore' button allows us to hover over any web element on the web page, and clicking on any element on the page displays the element locator, making it easy to locate element pathways. The location for the highlighted element is shown underneath it.

### **Test Trace Viewer**

Playwright [Trace Viewer](https://playwright.dev/docs/trace-viewer) is a GUI tool that allows us to view recorded Playwright traces after the script ran.  
In the test configuration file, set the `trace:'retain-on-failure'`  option. This will generate a trace.zip file for each test, but it will be removed from successful test runs.  

You can open the saved trace using :

```tsx
npx playwright show-trace trace.zip
```

<div style="text-align:center; margin: 10px;">
  <img src="/images/2022/04/trace_viewer.gif" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>


### **Parallel Testing in the same file**

Parallel testing is another useful aspect of Playwright. Unlike other tools, it allows you to simultaneously test multiple tests within a single file.  

By default, test files are executed in parallel. To deactivate parallelism, we must restrict the number of [workers to one](https://playwright.dev/docs/test-parallel#disable-parallelism). Also, by default, tests in a single file are executed sequentially in the same worker process. We may use `test.describe.parallel(title, callback)` to execute tests in a [single file in parallel](https://playwright.dev/docs/api/class-test#test-describe-parallel).

### **Screenshots and visual comparisons**

Playwright provides the ability to take snapshots during the test. It is even possible to compare your screenshots against pre-recorded ones.:

```tsx
expect(await page.screenshot()).toMatchSnapshot({maxDiffPixelRatio:0.001});
```


The maxDiffPixelRatio is required. Because modern browsers take shortcuts when rendering, the outcome is not completely replicable. Subpixel differences are common – something you don't notice, but it helps the browser to render faster. As a result, allowing for a limited number of distinct pixels makes sense. In any case, anti-aliased pixels are ignored by default.
Playwright makes use of the [pixelmatch](https://github.com/mapbox/pixelmatch) library. That is the node.js equivalent of [jLineUp](https://github.com/otto-de/jlineup), but it is much smaller and a better fit in a node.js context.

### **Locators**

Locators are the central piece of Playwright’s auto-waiting and retry-ability. In a nutshell, locators represent a way to find element(s) on the page at any moment.  

In this snippet, we captured the elements for [VWO](https://app.vwo.com/) login screen.

```tsx
// Getter for locators
  get inputEmail() {
    return this.page.locator('[id="login-username"]');
  }
  get inputPassword() {
    return this.page.locator('[id="login-password"]');
  }
  get btnSignin() {
    return this.page.locator('[id="js-login-btn"]');
  }
  ```

Notice that we are using ‘locator’ instead of the conventional element handle ($) to find web elements. The difference between the [Locator](https://playwright.dev/docs/api/class-locator) and [ElementHandle](https://playwright.dev/docs/api/class-elementhandle) is that the latter points to a particular element, while the Locator captures the logic of how to retrieve that element.

## **Conclusion**

Playwright is a great framework to explore, and it's just getting better as new capabilities are added in regular updates. It has evolved significantly since its inception and has a rising user base. I should clarify that this post merely scratched the surface of the Playwright iceberg. There are many more great aspects of Playwright that you should investigate, and I hope this post encourages you to do so.

According to the Playwright POC we did, it appears to be a suitable fit for our cases. Everything works well with Chrome. From Playwright's end, there were some challenges with our application's login screen. After submitting the form, it became stuck in the loading phase. A similar problem was already reported to the playwright team, and it was resolved within a short period of time. When writing end-to-end tests, one may face several difficulties. However, if you encounter problems, you may file a bug/feature request in [Git](https://playwright.dev/community/welcome#github) to get them addressed.