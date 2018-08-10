---
layout: post
title: "Speeding Up Pushcrew"
excerpt: Optimization of Pushcrew app's performance using splitchunksplugin
authorslug: surbhi_mahajan
author: Surbhi Mahajan
---

Recently we migrated pushcrew app to the webpack 4 which decreases build time and reduces chunk size by using Splitchunksplugin. It automatically identifies modules which should be split by heuristics and splits the chunks. This blog post deals with our efforts in understanding the mysterious splitchunks plugin.
### The Problem
Despite using efficient code splitting mechanism in our app, we noticed that a module of large size 740kb was duplicated in 4 async chunks. So, our goal was specifically to decrease the bundle size and utilize a better code splitting mechanism in the app.

We used webpack-bundle-analyzer to get a nice view of our problem:

![](/images/2018/04/duplicated_chunks_view.png)

### Observation
By default splitChunksPlugin only affects on-demand chunks and it split chunks based on conditions:
1. A new chunk can be shared or modules are from the node_modules folder
2. New chunk would be bigger than 30kb.
3. Maximum number of parallel requests when loading chunks on demand would be lower or equal to 5
4. Maximum number of parallel requests at initial page load would be lower or equal to 3

In our case, a separate chunk of large sized library would not be created.
**What's the reasoning behind this?**
It satisfies first and second conditions as it is being used in 4 chunks and its size (740kb) is bigger than 30kb so concludes that it should be in a new chunk. But it does not satisfy the third one as 5 chunks were already created at each dynamic import which is the maximum limit for async requests. We observed that the first 4 chunks include all modules which are requied by 7,6,5,5 async chunks respectively and the last one is its own chunk. Modules on which maximum number of async chunks are dependent on have been given priority and as emoji-mart is required by only 4 async chunks, a chunk containing emoji-mart.js would not be created.
### Solution
We can have more control over this functionality. We can change default configuration in the following ways:
1. increasing maxAsyncRequests result in more chunks. In Http2, 20 maxAsyncRequests improves performance but in HTTP 1.1, this result in more number of requests thus affects performance. So, this configuration should be preferred in case of Http2 only.
2. increasing minSize can also give the desired result. Some modules with higher duplicated frequencies and size less than minSize would not be included in separate chunks as they all violate the second condition. In case of minSize 100kb, modules greater than 100kb are considered giving more possibilities for creating a separate chunk containing emoji-mart.js.
### Experiments
**Steps**
1. Load campaign.triggered.create.custom route first and calculate the total content size loaded.
2. Then go to campaign.triggered.details route and calculate the content size again.
3. Then go to optIn route and calculate the content size one more time.

**Note**: campaign.triggered.create.custom and campaign.triggered.details chunks have many common modules like a third-party library (740 kb), composeNotification (146 kb) etc.

**Results with first approach**
| MaxAsyncRequests | campaign.triggered.create.custom | campaign.triggered.details |   optIn    |
|------------------|----------------------------------|----------------------------|------------|
|        5         |            1521.6 kb             |          758 kb            |  138.9 kb  |
|        10        |            1523.76 kb            |          79.1 kb           |  138.9 kb  |
|        15        |            1524 kb               |          79.1 kb           |  138.9 kb  |
|        20        |            1524.3 kb             |          79.1 kb           |  138.9 kb  |

After this change our bundles looked like this:

![](/images/2018/04/maxAsyncRequests_view.png)

**Results with second approach**
|      MinSize     | campaign.triggered.create.custom | campaign.triggered.details |   optIn    |
|------------------|----------------------------------|----------------------------|------------|
|       30 kb      |            1521.6 kb             |          758 kb            |  138.9 kb  |
|       50 kb      |            1521.6 kb             |          188 kb            |  148.8 kb  |
|       100 kb     |            1521.4 kb             |          78.4 kb           |  156.5 kb  |

After this change our bundles looked like this:

![](/images/2018/04/minSize_view.png)

**Note**: As you see, campaign.triggered.details size in case of 50 kb is 188 kb whereas its size is reduced to 78.4 kb in case of 100 kb. This is because composeNotification module (146 kb) that are shared between four other chunks are extracted into a separate chunk decreasing overall bundle size to 78.4 kb (Awesome!).
### Conclusion

As you see that increasing minSize and maxAsyncRequests both decreases the size of campaign.triggered.details chunk.
The second approach can result in multiple big chunks having multiple duplicated small sized modules.
On the other hand, the first approach will result in multiple small chunks which do not have any duplicated module. Loading multiple small chunks increases the loading time of page but with Http2, it will work efficiently.

Finally, we achieved what we wanted, a big library is now separated from our bundles and lazy loaded on demand. Thanks to [Dinkar Pundir] for helping me in solving the above problem.
If you have any doubt feel free to drop a comment.
**Happy Chunking...** !!
