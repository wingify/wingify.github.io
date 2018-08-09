---
layout: post
title: "Speeding Up Pushcrew"
excerpt: Optimization of Pushcrew app's performance using splitChunksPlugin
authorslug: surbhi_mahajan
author: Surbhi Mahajan
---

Recently we migrated pushcrew app to the webpack 4 which decreases build time and reduces chunk size by using SplitChunksPlugin. It automatically identifies modules which should be split by heuristics and splits the chunks. This blog post deals with our efforts in the understanding of the mysterious splitChunks Plugin.
### The Problem
Despite using efficient code splitting mechanism, one big module named emoji-mart.js having size 740kb is duplicated in 4 async chunks ( InstantNotification, campaign.triggered.create.custom, campaign.triggered.create.welcome, campaign.triggered.details ). Our goal was specifically to decrease the bundle size and utilize a better code splitting mechanism in the app.
### Observation
By default splitChunksPlugin only affects on-demand chunks and it split chunks based on conditions:
1. A new chunk can be shared or modules are from the node_modules folder
2. New chunk would be bigger than 30kb.
3. Maximum number of parallel requests when loading chunks on demand would be lower or equal to 5
4. Maximum number of parallel requests at initial page load would be lower or equal to 3

A separate chunk would not be created containing emoji-mart.js.
**Reason for its duplicity:**
It satisfies first and second conditions as it is being used in 4 modules and its size (740kb) is bigger than 30kb so concludes that it should be in a new chunk. But it does not satisfy the third one as 5 chunks are already created at each dynamic import which is the maximum limit for async requests. We observed that the first 4 chunks include all modules with duplicated frequencies 7,6,5,5 and the last one is its own chunk. Maximum duplicated modules have been given priority and as emoji-mart is duplicated in only 4 async chunks, a chunk containing emoji-mart.js would not be created.
### Solution
We can have more control over this functionality. We can change default configuration in the following ways:
1. increasing maxAsyncRequests result in more chunks. In Http2, 20 maxAsyncRequests improves performance and in HTTP 1.1, this result in more number of requests thus affects performance. So, this configuration should be preferred in case of Http2 only.
2. increasing minSize can also give the desired result. Some modules with higher duplicated frequencies and having size lesser than minSize would not be included in separate chunks as they all violate the second condition. In case of minSize 100kb, modules greater than 100kb are considered giving more possibilities for creating a separate chunk containing emoji-mart.js.
### Experiments
**Steps**
1. Load campaign.triggered.create.custom route first and calculate the total content size loaded in this page.
2. Then go to campaign.triggered.details route and calculate the total content size loaded in this page.
3. Then go to optIn route and calculate the total content size loaded in this page.

**Note**: campaign.triggered.create.custom and campaign.triggered.details chunks have many common modules like emoji-mart.js (740 kb), composeNotification (146 kb) etc.

**First Solution**
| MaxAsyncRequests | campaign.triggered.create.custom | campaign.triggered.details |   optIn    |
|------------------|----------------------------------|----------------------------|------------|
|        5         |            1521.6 kb             |          758 kb            |  138.9 kb  |
|        10        |            1523.76 kb            |          79.1 kb           |  138.9 kb  |
|        15        |            1524 kb               |          79.1 kb           |  138.9 kb  |
|        20        |            1524.3 kb             |          79.1 kb           |  138.9 kb  |

**Second Solution**
|      MinSize     | campaign.triggered.create.custom | campaign.triggered.details |   optIn    |
|------------------|----------------------------------|----------------------------|------------|
|       30 kb      |            1521.6 kb             |          758 kb            |  138.9 kb  |
|       50 kb      |            1521.6 kb             |          188 kb            |  148.8 kb  |
|       100 kb     |            1521.4 kb             |          78.4 kb           |  156.5 kb  |

**Note**: campaign.triggered.details size when minSize is 100 kb is 78.4 kb whereas its size is 188 kb when minSize is 50 kb. This is because, in 50 kb minSize case, a chunk includes composeNotification module (146 kb) resulting in higher size as compared to 100 kb minSize case.
### Conclusion

Increasing minSize and maxAsyncRequests both decreases the size of campaign.triggered.details chunk.
The Second approach can result in multiple big chunks having multiple duplicated modules.
On the other hand, the first approach will result in multiple small chunks which do not have any duplicated module. Loading multiple small chunks increases the loading time of page but with Http2, the first approach will work efficiently.

Finally, we achieved what we wanted, a big library emoji-mart-vue are now separated from our bundles and lazy loaded on demand. Thanks to [Dinkar Pundir] to help me in solving the above problem.
If you have any doubt feel free to drop a comment.
**Happy Chunking...** !!
