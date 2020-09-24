---
layout: post
title: Performance improvements in VWO SmartCode
excerpt: Performance improvements in VWO SmartCode
authorslug: shubham_soni_udit_chawla
author: Shubham Soni, Udit Chawla
---
VWO puts a lot of focus on ensuring websites remain performant enough while using VWO. We have been increasing the efforts in this area and due to this, we are able to bring two very big optimizations which would directly reduce the impact on the performance of the websites.

## jQuery Dependency Removed

[VWO](https://vwo.com/) primarily used to be an A/B testing tool (now a complete Experience Optimization Platform) wherein customers can apply changes to their websites using VWO’s editor without having to make changes in their website code. To achieve this we required a DOM manipulation and traversal library which was well supported on all the browsers and jQuery was the best choice back then.

It has served us well over the years but we could not update jQuery and were stuck with its version 1.4.2 because of a [feature](https://help.vwo.com/hc/en-us/articles/360020730394-What-Is-VWO-Code-Editor) we provide to our customers wherein they can use any API of jQuery(exposed by VWO as vwo_$). It allowed customers not to include jQuery twice on the page if the customer’s website was already using it. It was the right choice back then as jQuery was very popular and almost every website had it. But as people started using various methods of jQuery, there was a risk in upgrading jQuery version because we can’t be sure what methods are being used by customers and what changes in those methods’ APIs had been done in newer versions of jQuery.

To improve the performance of the library we decided to write a small alternative of jQuery based on [cash.js](https://github.com/kenwheeler/cash/) and jQuery.js, this new library is around 13KB (Minified and Uncompressed) as compared to 70.5 KB(Minified and Uncompressed) of jQuery 1.4.2.

Why not jQuery

-  jQuery is huge in uncompressed size (70.5KB).
    

    -   jQuery needs to take care of all the browser quirks and in all possible ways, a method is called.
    

-   We were also not using all the features that it had to offer.
    

    -   jQuery provides a lot of methods and not all of them are required for our purpose, For example, we don’t require animation support in CSS
    
    -   It provides a [custom builder](https://projects.jga.me/jquery-builder/) that allows users to skip certain modules but the resulting JS size was still a lot as it has unwanted things not used by us.
    

  

So, the solution was to create our own alternative of jQuery which would meet the following requirements.

1.  A very custom solution implementing only the functionality required by VWO - to keep the code size smallest possible supporting IE11+ and all other browsers (Chrome/Firefox/Opera/Safari/Edge). We used [Browserlist](https://browserl.ist/?q=defaults) to identify browsers’ share and decided to not support browsers with percentage share less than 1 percent.
    
2.  It should conform to jQuery API so that almost no change is required in the code using jQuery earlier.
    
3.  It should be as stable as jQuery. 
    

### Steps we took to migrate to “no jQuery”

1.  We started by scanning the entire library codebase for calls matching vwo_$().methodName with a regular expression search and were able to get a list of jQuery methods being used by VWO.
    
2.  We found out methods that were just “syntactic sugar” and were being used e.g. there was first() method which is technically equivalent to eq(0). So, we changed the usage of the first method to eq(0).
    
3.  We started taking the implementation of the methods from the latest jQuery version as-is and started removing the code that wasn’t for us.
    
4.  We took the tests from cash.js and ran its tests. We chose cash.js tests for this because it’s functionality is a very small subset of jQuery and is mostly a superset of our requirements. A lot of tests failed and we identified which failures are acceptable and which are not and accordingly modified the tests.
    
5.  We integrated the new library with our codebase and ran tests. We have a good number of Integration tests and E2E Tests apart from Unit tests for our libraries using the jQuery. Even though our existing Unit Tests didn’t help here but good coverage with Integration and E2E tests helped in finding bugs.
    
6.  Apart from Automated Tests, we did a good amount of Manual Testing across various browsers and platforms with all the libraries which took the major effort.
    
7.  Once all testing passed, we decided to enable this new library for [vwo.com](https://vwo.com/) as the website uses VWO itself to monitor the errors in production.
    

	  -  This was required to test the library in production with all sorts of devices and browsers visitors come from.
    
	  - The website has [sentry](https://sentry.io/organizations/vwo/issues/) in place to track any errors coming on the website.
    
	  - We monitored the errors for a few days and were able to identify a few bugs from it which neither our automation nor manual testing was able to catch.
    

8.  After the bugs were fixed, we monitored for a few more days just to be sure and then we enabled it for all the new users signing up for VWO. It isn’t possible to enable it for existing accounts as they might be using some methods of jQuery directly.
    
9.  Next, we would be working on a way to reliably identify accounts for which the new library can be automatically enabled.
    

Below are the performance stats for a static and local website (we chose this to eliminate network fluctuations) using the two different versions of our library. All the stats are median of five performance audits we did.
<table style="width:70%"  align="center" border="1px solid black">
<thead>
  <tr align="center">
    <th></th>
    <th>Time to Interactive</th> 
    <th>First CPU Idle</th>
    <th>Performance Score</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>With jQuery </td>
    <td>6.1</td>
    <td>5.9</td>
    <td>74</td>
  </tr>
  <tr>
    <td>Without jQuery</td>
    <td>5.4</td>
    <td>5.1</td>
    <td>79</td>
  </tr>
  </tbody>
</table>

## Brotli Compression for all Static Files

[Brotli](https://github.com/google/brotli/blob/master/c/tools/brotli.md) is a compression technique introduced by google. It is a lossless compression algorithm that compresses data by using the combination of the LZ77 algorithm, Huffman coding, and 2nd order context modelling. It is similar in speed to deflate but offers denser compression.


[![](https://lh5.googleusercontent.com/AevuoDiVqRfwwk6feRa7dxx4rk-EPH0QnDWj0-Z5qmJUQJ_OfaKisc2s340Mo4BlS19UczC5ck6C48m-TtETAHiqsTiCgL7hCuL9ntT-rSzpeAqZboNPx-QR8JMVMlOOrPzC4dPE)](https://caniuse.com/#search=brotli)

  

### Why brotli?

It is well supported by all popular browsers. It is reported to have [gains up to 25%](https://paulcalvano.com/index.php/2018/07/25/brotli-compression-how-much-will-it-reduce-your-content/) over gzip compression. This info was enough to get us focussed on implementing Brotli on our [CDN](https://engineering.wingify.com/posts/dynamic-cdn/). Fewer bytes transferred over the network not only leads to a decrease in the page load time but also decreases the cost of serving the file.

  
  
  

### Why just Static Files?

We found that compressing resources on the fly won’t lead to performance optimization in a straightforward manner as compression time which is on the higher side for brotli as compared to gzip might impact response time. See [https://blogs.dropbox.com/tech/2017/04/deploying-brotli-for-static-content/](https://blogs.dropbox.com/tech/2017/04/deploying-brotli-for-static-content/)  for more details. So we avoided that in the first implementation. Also, as Brotli is meant to compress text files and shouldn’t be used for binary files, we skipped images from brotli compression.

  

### Steps we took to move from gzip to Brotli for Static Files

Brotli Compression was something that would be enabled for all of our customers at once(Per account strategy wasn’t possible as the static requests don’t contain VWO Account Id) and we had to be extra sure that in no circumstance our customers’ data is impacted. So, carefully followed the following steps:

-   We compressed all the static files during our NodeJS based Build process with the highest level of compression Level(i.e. 11)
    

    -   The built files contained three versions of the files
    

        -   Uncompressed
    
        -   Brotli Compressed (.br)
    
        -   Gzip Compressed (.gz)
    

    -   Earlier we used [https://github.com/foliojs/brotli.js](https://github.com/foliojs/brotli.js) but we found that it failed to compress small files([https://github.com/foliojs/brotli.js/issues/19](https://github.com/foliojs/brotli.js/issues/19)). So, we moved to [https://github.com/MayhemYDG/iltorb](https://github.com/MayhemYDG/iltorb). Our automation caught this bug. More on automation later.
    

-   We use OpenResty at our [CDN](https://engineering.wingify.com/posts/dynamic-cdn/) and we already had certain rewrite rules in Lua in place to be able to serve different content to different browsers. There we added support for serving already compressed brotli files.
    

    -   We read the ‘Accept-Encoding’ header and identified the encoding supported by the UserAgent from there.
    
    -   If the UserAgent claimed to support brotli we served brotli otherwise, we served gzip. We assume that there is no browser that doesn’t support gzip which is validated by [https://caniuse.com/#search=gzip](https://caniuse.com/#search=gzip)
    
    -   We made sure the Vary: Accept-Encoding response header is set in all cases. More on this later.
    

-   Before making it to the production we wanted to be sure that in the production all browsers which claim to have the support of brotli are able to decompress at the highest level of compression. For this, we decided to compress our most used library and served it on vwo.com as an independent request. We identified a particular string in the library and made sure that it was present every time. In case it’s not present or the response code wasn’t 200 we logged it as an error on Sentry. We monitored the logs for 2 days and found no issues. So, all ok from this angle.
    
-   Due to the relatively complex release process of VWO libraries, it wasn’t practical to create brotli files for all the possible static files [We have versioning for all files]. Due to this, we had to modify Nginx conf location blocks to force any requests to deprecated files to redirect to the latest stable version of that file. It required all possible static content serving endpoints to be tested.
    

  

### How did we make sure that there were no issues with the release?

To ensure that there were no issues with the new version of the VWO library we wrote Request Response based automation test cases for our CDN in addition to the existing e2e test cases. We created a list of all possible static files that are served by our CDN by scanning all our libraries built code through automation. We combined it with all the possible versions of our libraries and it created a list of all possible endpoints (including some non-existent endpoints as some files are not servable in certain versions) that we have.

It verified the following things for all those endpoints:-

-   For different variations of the Accept-Encoding request header file with the expected compression was served. Expected Compression was verified by Checking the Content-Encoding Response Header.
    
-   Status Code is 200. If the Status Code is non-200 (Remember there were non-existent endpoints in it), it would verify it with one of the designated production CDN nodes to see if that also returned the same non-200 status code. If yes, then it’s a non-existent endpoint otherwise it’s a bug.
    
-   We have endpoints like [https://dev.visualwebsiteoptimizer.com/6.0/va.js](http://dev.visualwebsiteoptimizer.com/6.0/va.js). Here 6.0 means 6.0 version of the library. We used the framework to ensure that the content for the request corresponds to the requested version. Almost all of our files have versioning information in them.
    
-   Bonus, we used the effort done in framework implementation to verify licenses also for all of our endpoints. Plus, the framework is flexible enough to verify anything in response.
    

We didn’t make the changes live in one go on all our CDN nodes. We started with a node with the least amount of traffic with careful monitoring. We monitored the logs for a day and then proceeded to make it live on the other servers as well.

Our Testing library - Most Used[Sizes are with the new version in which jQuery doesn’t exist]

With gzip

![](https://lh5.googleusercontent.com/tgRjC_VNMrWMr0Lirng3CyPMQzxfFEsfvCbWf4WpPkvP-9ArudoMXCP8OhHbWxhOi-bAMAHAW_w1eFBs2A-cb9TWQBcQ0k3icv1Lvv9FZO43uWpSuHQiV_jIhPntr4xNKoG5ggfB)

With Brotli

![](https://lh6.googleusercontent.com/knj7kYBN3217lPwqPC25gsL4lwB9u0L2r2XYOTnjnvzzCZoCIAmJgn-6Esh-eLZmLQOn0MUV-XO_c7ocZhoi_2l8xUIII_88hU7z6aMS30e6fKudh42HdUOAKqZ5W4WemHVhVGOp)

### The importance of Vary Header



To make sure that any HTTP Cache does not cache a specific compressed file and serve it for all UserAgents regardless of the decompression support at that UserAgent, we are using the vary header with Accept-Encoding to make sure the right file is served to the User-Agent. You can read more about it at [https://www.fastly.com/blog/best-practices-using-vary-header](https://www.fastly.com/blog/best-practices-using-vary-header)

### Future Plans

Currently this library is available for new customers only. But we are planning to deploy this library for all of our existing customers. It would require to figure out if they are using any jQuery method directly or not.
Also, we would be experimenting with brotli compression on the fly for our non-static files.

This is not the end of our performance improvement journey. Stay tuned !
