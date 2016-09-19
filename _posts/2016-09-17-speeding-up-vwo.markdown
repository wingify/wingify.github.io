---
layout: post
title: "Speeding up VWO"
excerpt: How we optimized the performance on VWO app
authorslug: dinkar_pundir
author: Dinkar Pundir
---


About two years ago, Wingify had introduced the [new generation of our Visual Website Optimizer][1] to the world. Boasting a modern visual interface, it also had many new features. We’ve come a long way since then. We’ve added even more features to it while improving the previous ones. But with continuous development, it becomes imperative to keep the app lean and fast as well. New features, unless proactively attended to, usually make apps slower. This effect is especially prominent in SPA apps which have to be download first on the browser before they can execute. Thus, performance management is an iterative and continuous process. This post is largely the collection of our learnings and implementations done on/to our app to keep it lean and slick.

There are several types of performances when it comes to modern web applications. This blog post chiefly deals with our efforts in improving the app load time. This was also the first phase of the plan since the first things users notice is how soon can they start working the app.

### Performance Monitoring Tools

To measure performance, we’ve installed monitoring tools which help us visualize the improvement or deterioration of the app with every release made to production. The chief ones among them are:

1. **Speedcurve** — [Speedcurve][2] generates a detailed report of the key metrics to measure network performance. Speedcurve ensures that the each release is monitored. It has a detailed dashboard which shows the health of the app over a period of time. If there’s a negative impact in performance it sends a mail with details of the key performance parameters (like the content size of the page, content requests made by the page, page load time, rendering time etc.).

2. **Web Page Test Charts API** — We’ve also installed a custom flavour of Trulia’s open source [Webpage Test Charts API][3] . Since both Speedcurve and Web Page Test Charts API essentially get the test results from webpagetest.org the benchmarking source is same. Web Page Test Charts API allows us to view other parameters which Speedcurve doesn’t show.

### Performance Improvement Measures

Apart from the tools placed to measure performance, we’d also been busy shipping the following boosts to the app: 

1. **Upgrade to AngularJS 1.5** — While making the VWO App, two years back, the most stable version of AngularJS present was 1.2. Since then several versions have released with the latest one being 1.5. The [features][4] and performance benefits of 1.5 over 1.2 we convincing enough to make the move. But there were a plenty of breaking changes which kept the Dev team as well as the QA team busy for quite some time in making sure that the upgraded code was bug free and the customers have a seamless transition. I’m glad to share that we’ve finally made the transition.

2. **Move to HTTP/2 Protocol** — [HTTP/2 protocol][5], the successor of the HTTP 1.1 protocol and based loosely on the SPDY protocol provides several benefits. It enables multiplexing of resources across single TCP connection, compressing and reducing HTTP headers and also supports Server Push (The server can optimistically push resources to the browser which it understands that the browser might require). HTTP/2 has good browser support and is backward compatible with HTTP 1.1 which means browsers not supporting it can fallback to the older protocol.

3. **Move to HTTPS** — HTTPS is a precondition for HTTP/2. So, yay!

4. **Reduce the initial app content on bootstrap** — We’ve reduced the initial app loading size by more than a 100 KBs (and more… or should I say **less**… to come). This has been achieved due to the combined result of:
  - **Removing heavy libraries with their lighter counterparts** - We've completely removed libraries like Angular Bootstrap and Chosen from our app dependency. These have been replaced by inhouse implementations of the respective libraries.
  - **Loading only the modules critical to bootstrap, on bootstrap** - On analyzing, our app's bootstrap process, we realized that several modules which weren't critical to it were still loaded. After some code refactor these modules have been eliminated from the process.
  - **Splitting of vendor files into primary and secondary** - More on that later in the post.

5. **Implement better cache-bust mechanism** — We've moved to naming our files based on [MD5][6] of their content instead of naming them based on their timestamp of generation. This has resulted in generations of fewer unique files on every build. Only the files which are modified get renamed. 

6. **ETags for the index page** — The [ETag or entity tag][7] based on the HTTP protocol allows the client to make conditional requests. This enhances the caching mechanism and saved bandwidth since the browser only makes the request when the file has changed. Ergo, better loading time!

7. **Split vendor files into primary and secondary** — It is a common practice in web development to combine all the libraries, required by the app, into a single file. Usually, this is called the vendor file and it gets downloaded entirely in the beginning. Often, several components of the vendor file aren’t required in the usual app usage, but they still get downloaded since it’s a single bundle. We’ve divided the vendor file into two and split their contents based on the frequency of usage. The first vendor file contains the all the libraries which are absolutely necessary for the application to load. For example, AngularJS and its dependencies. The second vendor file is loaded on demand based on modules which require less frequently required libraries, for example, Graph libraries to show graphs. By doing so we’ve cut a good chunk of 200+ KBs from the original monolithic vendor file, a considerable amount by any standard.

8. **Implement login page in vanilla JS** — The VWO app is written in AngularJS framework. AngularJS is a heavy framework. To add to the woe it has tons of dependencies. The benefit of moving the login page out of AngularJS context, and keeping it in plain JS has a two-fold benefit. Firstly, the login page become lighter since it isn’t dependant on the framework anymore. Secondly, by utilising the time that the user takes in filling his credentials we can load, as much of the app, in the background, as possible. Thus, when the user is done signing in a major portion of the app, if not all, would’ve been already downloaded.

We’ve come a long way from the initial VWO app that was made two years back. And we still have a lot to cover. As we see it, this is just the tip of the iceberg. We’ll be publishing more posts on the improvements that we push to the app. If you have any suggestions, queries or concerns feel free to drop a comment.

  [1]: https://vwo.com/blog/launching-new-vwo/
  [2]: https://speedcurve.com/
  [3]: https://github.com/trulia/webpagetest-charts-api
  [4]: https://medium.com/google-developer-experts/angular-new-features-in-angularjs-1-5-24f9b503af15#.87u227j06
  [5]: https://en.wikipedia.org/wiki/HTTP/2
  [6]: https://en.wikipedia.org/wiki/MD5
  [7]: https://en.wikipedia.org/wiki/HTTP_ETag