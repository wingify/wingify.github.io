---
layout: post
title: Demystifying Webpack 4 Split Chunks Plugin 
excerpt: Webpack 4 Split Chunks plugin
authorslug: surbhi_mahajan
author: Surbhi Mahajan
---

Recently, we migrated one of our web apps to the Webpack 4, which decreases build time and reduces chunk size by using Split Chunks plugin. It automatically identifies modules which should be split by heuristics and splits the chunks. This blog post deals with our efforts in understanding the mysterious Split Chunks plugin.
### The Problem
The problem we were facing with [default](https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks) Split Chunks config is that a module of large size **550 KB** was duplicated in 4 async chunks. So, our goal was specifically to decrease the bundle size and utilize a better code splitting mechanism in the app.

Our Webpack configuration file looks like this:

{% highlight js %}
// Filename: webpack.config.js

const webpack = require('webpack');
module.exports = {
   //...
   optimization: {
      splitChunks: {
         chunks: 'all'
      }
   }
};
{% endhighlight %}

We used [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) to get a nice view of our problem.

![](/images/2018/08/split-chunks-duplicated-view.png)
### Observation
By default, Split Chunks plugin only affects on-demand chunks and it split chunks based on following [conditions](https://webpack.js.org/plugins/split-chunks-plugin/#defaults):
1. A new chunk should be shared or containing modules should be from the node_modules folder.
2. New chunk should be bigger than 30 KB.
3. Maximum number of parallel requests when loading chunks on demand should be lower or equal to 5.
4. Maximum number of parallel requests at initial page load should be lower or equal to 3.

In our case, a separate chunk of the large-sized library would not be created.

**What's the reasoning behind this?**

It satisfies first and second conditions as it is being used in 4 chunks and its size (550 KB) is bigger than 30 KB so concludes that it should be in a new chunk. But it does not satisfy the third one as 5 chunks were already created at each dynamic import which is the maximum limit for async requests. We observed that the first 4 chunks include all modules which are shared among 7,6,5,5 async chunks respectively and the last one is its own chunk. Modules on which a maximum number of async chunks are dependent on have been given priority and as a library is required by only 4 async chunks, a chunk containing it would not be created.

When we run `yarn build` to build our assets, a chunk named **vendors~async.chunk.1~async.chunk.2~async.chunk.3~async.chunk.4** is not found in the output:

![](/images/2018/08/split-chunks-default-build-view-1.png)

![](/images/2018/08/split-chunks-default-build-view-2.png)

### Solutions
We can have more control over this functionality. We can change default configuration in either or combination of the following ways:
1. Increasing [maxAsyncRequests](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-maxasyncrequests) result in more chunks. A large number of requests degrades the performance but it's not a concern in HTTP/2 because of the [request and response multiplexing](https://developers.google.com/web/fundamentals/performance/http2/). So, this configuration should be preferred in case of HTTP/2 only.

    Now let’s take a look at Webpack configuration file after this change:

    {% highlight js %}
        // Filename: webpack.config.js

        const webpack = require('webpack');
        module.exports = {
            //...
           optimization: {
              splitChunks: {
                 chunks: 'all',
                 maxAysncRequests: 20
              }
           }
        };
    {% endhighlight %}

2. Increasing [minSize](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-minsize) also gives the desired result. Some modules with higher usage in our app and size less than minSize would not be included in separate chunks as they all violate the second condition like in case of minSize 100 KB, modules greater than 100 KB are considered giving more possibilities for creating chunks containing large-sized modules.

    Now let’s take a look at Webpack configuration file after this change:

     {% highlight js %}
        // Filename: webpack.config.js

        const webpack = require('webpack');
        module.exports = {
            //...
           optimization: {
              splitChunks: {
                 chunks: 'all',
                 minSize: 100000
              }
           }
        };
     {% endhighlight %}


### Experiment

**Steps:**
1. We picked any two async chunks between which a large-sized third-party library (550 KB) is shared. Let's call these chunks as async.chunk.1 and async.chunk.2 and assume that chunk's name and corresponding route's name are same.
2. Loaded async.chunk.1 route first and calculated the total content size loaded.
3. Then navigated from async.chunk.1 route to async.chunk.2 route and calculated the content size again.

**Results with first approach(varying the maxAsyncRequest property):**

<pre>
|   MaxAsyncRequests   |           async.chunk.1          |        async.chunk.2       |
|----------------------|----------------------------------|----------------------------|
|          5           |            1521.6 KB             |          758 KB            |
|          10          |            1523.76 KB            |          79.1 KB           |
|          15          |            1524 KB               |          79.1 KB           |
|          20          |            1524.3 KB             |          79.1 KB           |
</pre>

After this change our bundles look like this:

![](/images/2018/08/split-chunks-maxAsyncRequests-view.png)

With this configuration, a separate chunk named **vendors~async.chunk.1~async.chunk.2~async.chunk.3~async.chunk.4** is created which is shown below:

![](/images/2018/08/split-chunks-maxAsyncRequests-build-view.png)


**Results with second approach(varying the minSize property):**

<pre>
|       MinSize       |          async.chunk.1           |        async.chunk.2       |
|---------------------|----------------------------------|----------------------------|
|        30 KB        |            1521.6 KB             |          758 KB            |
|        50 KB        |            1521.6 KB             |          188 KB            |
|        100 KB       |            1521.4 KB             |          78.4 KB           |
</pre>

After this change our bundles look like this:

![](/images/2018/08/split-chunks-minSize-view.png)

In this case too, a large-sized library is extracted into a separate chunk named **vendors~async.chunk.1~async.chunk.2~async.chunk.3~async.chunk.4** which is shown below:

![](/images/2018/08/split-chunks-minSize-build-view.png)

**Note**: async.chunk.2 chunk size in case of 50 KB minSize configuration is 188 KB whereas its size is reduced to 78.4 KB in case of 100 KB minSize configuration. This is because one more module of size 146 KB that are shared among four other chunks are extracted into a separate chunk decreasing overall bundle size to 78.4 KB (Awesome!).
### Conclusion

Increasing minSize and maxAsyncRequests both decreases the size of async.chunk.2 chunk.

The second approach can result in multiple large-sized chunks, each one having multiple duplicated small-sized modules.
On the other hand, the first approach will result in a large number of small chunks which do not have any duplicated module. Loading multiple small chunks increases the loading time of page but with HTTP/2, it will work efficiently.

Finally, we achieved what we wanted, a big library is now separated from our bundles and lazy loaded on demand. Thanks to [Dinkar Pundir](https://twitter.com/dinkarpundir) for helping me in solving the above problem.
If you have any doubt feel free to drop a comment or tweet us at [@wingify_engg](https://twitter.com/wingify_engg).

**Happy Chunking...** !!
