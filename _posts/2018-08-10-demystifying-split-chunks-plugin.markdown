---
layout: post
title: Demystifying webpack 4 split chunks plugin: Volume 1
excerpt: webpack 4 split chunks plugin
authorslug: surbhi_mahajan
author: Surbhi Mahajan
---

Recently we migrated one of our webapps to the webpack 4 which decreases build time and reduces chunk size by using split chunks plugin. It automatically identifies modules which should be split by heuristics and splits the chunks. This blog post deals with our efforts in understanding the mysterious split chunks plugin.
### The Problem
The problem we were facing with [default](https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks) splitChunks config is that a module of large size 550kb was duplicated in 4 async chunks. So, our goal was specifically to decrease the bundle size and utilize a better code splitting mechanism in the app.

Our webpack configuration file looks like this:

```javascript
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
```

We used [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) to get a nice view of our problem

![](/images/2018/04/duplicated_chunks_view.png)
### Observation
By default split chunks plugin only affects on-demand chunks and it split chunks based on [conditions](https://webpack.js.org/plugins/split-chunks-plugin/#defaults):
1. A new chunk can be shared or modules are from the node_modules folder
2. New chunk would be bigger than 30kb.
3. Maximum number of parallel requests when loading chunks on demand would be lower or equal to 5
4. Maximum number of parallel requests at initial page load would be lower or equal to 3

In our case, a separate chunk of large-sized library would not be created.

**What's the reasoning behind this?**

It satisfies first and second conditions as it is being used in 4 chunks and its size (550kb) is bigger than 30kb so concludes that it should be in a new chunk. But it does not satisfy the third one as 5 chunks were already created at each dynamic import which is the maximum limit for async requests. We observed that the first 4 chunks include all modules which are shared among 7,6,5,5 async chunks respectively and the last one is its own chunk. Modules on which maximum number of async chunks are dependent on have been given priority and as library is required by only 4 async chunks, a chunk containing it would not be created.
### Solutions
We can have more control over this functionality. We can change default configuration in the following ways:
1. Increasing maxAsyncRequests result in more chunks. In Http2, 20 maxAsyncRequests improves performance but in HTTP 1.1, this result in more number of requests thus affects performance. So, this configuration should be preferred in case of Http2 only.

    Now let’s take a look at webpack configuration file after this change:

    ```javascript
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
    ```


2. Increasing minSize can also give the desired result. Some modules with higher usage in our app and size less than minSize would not be included in separate chunks as they all violate the second condition like in case of minSize 100kb, modules greater than 100kb are considered giving more possibilities for creating chunks containing large-sized modules.

    Now let’s take a look at webpack configuration file after this change:

     ```javascript
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
     ```


### Experiment

campaign.triggered.create.custom and campaign.triggered.details chunks have many common modules like a third-party library, composeNotification module etc.

**Steps:**
1. We picked two async chunks named campaign.triggered.create.custom and campaign.triggered.details respectively between which a large-sized module is shared.
2. Loaded campaign.triggered.create.custom route first and calculated the total content size loaded.
3. Then loaded campaign.triggered.details route and calculated the content size again.


**Results with first approach:**


| MaxAsyncRequests | campaign.triggered.create.custom | campaign.triggered.details |
|------------------|----------------------------------|----------------------------|
|        5         |            1521.6 kb             |          758 kb            |
|        10        |            1523.76 kb            |          79.1 kb           |
|        15        |            1524 kb               |          79.1 kb           |
|        20        |            1524.3 kb             |          79.1 kb           |

After this change our bundles looked like this:

![](/images/2018/04/maxAsyncRequests_view.png)

**Results with second approach:**


|      MinSize     | campaign.triggered.create.custom | campaign.triggered.details |
|------------------|----------------------------------|----------------------------|
|       30 kb      |            1521.6 kb             |          758 kb            |
|       50 kb      |            1521.6 kb             |          188 kb            |
|       100 kb     |            1521.4 kb             |          78.4 kb           |

After this change our bundles looked like this:

![](/images/2018/04/minSize_view.png)

**Note**: campaign.triggered.details size in case of 50 kb is 188 kb whereas its size is reduced to 78.4 kb in case of 100 kb. This is because one more module of size 146 kb that are shared among four other chunks are extracted into a separate chunk decreasing overall bundle size to 78.4 kb (Awesome!).
### Conclusion

Increasing minSize and maxAsyncRequests both decreases the size of campaign.triggered.details chunk.

The second approach can result in multiple big chunks having multiple duplicated small-sized modules.
On the other hand, the first approach will result in multiple small chunks which do not have any duplicated module. Loading multiple small chunks increases the loading time of page but with Http2, it will work efficiently.

Finally, we achieved what we wanted, a big library is now separated from our bundles and lazy loaded on demand. Thanks to [Dinkar Pundir](https://twitter.com/dinkarpundir) for helping me in solving the above problem.
If you have any doubt feel free to drop a comment or tweet us at @wingify_engg.

**Happy Chunking...** !!
