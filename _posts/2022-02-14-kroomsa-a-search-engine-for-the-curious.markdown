---
layout: post
title: "Kroomsa: A search engine for the curious"
excerpt: "Kroomsa: A search engine for the curious"
authorslug: aakash_chawla
author: Aakash Chawla
---

## Introduction

The search algorithm implemented in your website greatly influences visitor engagement. A decent implementation of a search algorithm can significantly reduce dependency on standard search engines like Google for every query thus, increasing engagement. Traditional methods look at terms or phrases in your query to find relevant content based on syntactic matching. Since you can use a sentence or a word in multiple contexts, this approach alone is ineffective, and the results are often a hit or a miss. At VWO, as a fun side project, we developed an algorithm that uses semantic matching to find content relevant to your query. We implemented this approach as a modern search engine, **Kroomsa: A search engine for the curious**. Kroomsa engages users by exposing them to relevant yet interesting content during their session. Here is a look at [Kroomsa in action](https://www.youtube.com/watch?v=xvgdAEEvhsA).

## Current Work

Search engine giants like Google use algorithms that look at many factors, including the words of your query, relevance, and usability of pages, the expertise of sources, and your location and additional settings. These features are dynamically weighted, and the weight applied varies depending on the nature of your query. These algorithms are evaluated rigorously through live experimentation and coordination with external search quality raters. 
Our proposed approach is not as complex or meticulous as the previous work in the field, but it improves upon traditional search algorithms that solely rely on syntactic matching. We use a deep learning model to understand the intention and context of the query to match it with appropriate content. **It enables us to map user queries to documents that do not even contain the exact phrase**. For example, the query "working desk" can match with content relevant to "study table".

## Motivation

Kroomsa as a product does not align well with what VWO currently offers. It was never intended to be a final product in its current form but is a great avenue to test the algorithm at its core, similarity search. We combined various existing techniques in literature to develop this algorithm that identifies information that is relevant to the query. We modeled a modern search engine around it to procure feedback from potentially interested customers. The goal was to package the mature version of the search algorithm as an add-on that our customers could deploy on their websites.

## Overview

Kroomsa uses similarity search at its core to provide relevant yet intriguing information to the user. The performance of any machine learning algorithm is dependent on the quality of data. So before detailing the algorithm, let us explore the dataset that we collected for Kroomsa.

### Dataset

Kroomsa exists to answer your questions with relevant information that you might want to know. To do so, we needed a data source with genuine questions and their appropriate answers. We chose Reddit for this purpose.
We scraped a total of 7 QnA subreddits since their inception, and through heuristics, we made sure that the selected questions were valid and their answers were relevant.

### Preprocessing

Preprocessing is essential while developing a practical machine learning approach. It helps in ensuring that irrelevant data points are filtered out. To decide the quality of a QnA pair, we employed the following heuristics:
1. The posted question should have enough upvotes.
2. Content should be in English.
3. Content should not violate any guidelines.
4. The top comment should have enough upvotes to be selected as the corresponding answer.
5. The post should be publicly accessible on Reddit and not deleted by any parties involved.

### Vectorisation

Traditional search engines use structured tables that map the content to a symbolic representation. These symbolic representations are far inferior and inflexible to the neural descriptors obtained from machine learning approaches like word2vec.
We decided to use [Universal Sentence Encoder](https://tfhub.dev/google/universal-sentence-encoder/4) (USE) in Tensorflow to create neural representations of the posts as they cannot be used as-is. USE allows greater than length encoding of phrases into their corresponding embeddings. These embeddings capture the intent of the input phrase, thus making them a powerful tool to represent natural language.

### Similarity Search: Heart of Kroomsa

Similarity search refers to a class of algorithms that typically search a space of objects where the comparator is the similarity between the pairs. But to do it at scale is a challenging task. Since a search engine has to be quick in finding the relevant content and answers to the queries posted by the user, using inferior implementations can lead to a worse experience for the user.
We decided to use a library called [FAISS](https://github.com/facebookresearch/faiss) developed by Facebook. It boasts a performance speedup of up to 8.5x the previous state-of-the-art approaches on billion scale datasets. FAISS also provides a state-of-the-art GPU implementation of the search algorithms that provide a significant speedup and improve the user experience over CPU-based approaches.
Kroomsa uses a 512-dimensional Flat index created using FAISS. The index uses Euclidean distance to measure the similarity between the vector representations of different posts. After encoding each query using USE, a similarity search based on Euclidean distance executes that fetches 20 most relevant QnA pairs from the database. The answer that corresponds to the most similar QnA pair is the designated answer. And a few other pairs are shown as intriguing content that users can explore.

### Emojis: A fun addition

To animate our textual questions and answers, we decided to attach relevant emotions to them. The core logic that drives Kroomsa also helps to discover relevant emojis.
We curated a dataset that mapped emojis to relevant tags that best described their conveyed emotion. These tags were then transformed into their neural representations using [distilbert-base-nli-stsb-mean-tokens](https://huggingface.co/sentence-transformers/distilbert-base-nli-stsb-mean-tokens) model. We executed a similarity search to find the most relevant emojis for each QnA pair in our database. Kroomsa displays these emojis along with each post to enhance user engagement.

## Evaluating the Algorithm
Evaluating the results of a search engine is not a trivial task. Giants like Google use online experiments and search quality raters to evaluate the quality of their search algorithms. Due to its resource-intensive nature, we evaluated our approach through collected feedback. 
"Plan on using Kroomsa instead of Youtube to go down a rabbit hole for exposure to new ideas." A user wrote as feedback affirming the quality of the search algorithm. Another user complemented that the results shown by Kroomsa were refreshing due to the absence of any SEO. While the feedback was mostly positive, many users pointed out the lack of information sources as an obvious flaw that affected their experience.

Let us discuss the performance aspect and hardware requirements for a satisfactory implementation. To test the performance of Kroomsa, we used **Siege**,  a benchmarking tool that allows you to simulate users accessing a website. Fifty synthetic users concurrently posted requests on Kroomsa for a load test.

<div style="text-align:center; margin: 10px;">
    <img src="../images/2022/02/kroomsa_load_test.png">
</div>

We quickly identified a few issues with our approach:
* Slow Average response time
* The worst-case response time recorded was 5.31 seconds.

The reason for slow response times and poor performance under load is the exhaustive nature of the search. We also timed the different segments of our entire process to offer a holistic view of which phase requires how much time.
* Embedding: Time to convert the query to a vector representation using USE.
* Faiss: Time to search the index
* Mongo: Time to map and retrieve the search results from the database.

Note: Each time measurement is in seconds

<div style="text-align:center; margin: 10px;">
    <img src="../images/2022/02/modules_timing_info.png">
</div>

Using non-exhaustive algorithms means trading off accuracy with speed. So we decided to switch to a GPU-based implementation of the exhaustive search. It exponentially increases the performance of the system without sacrificing accuracy.
Using the cheapest GPU available that increased our server cost to 2.61x the original, we obtained a 10x speedup in processing times. GPU-based implementation processed 100 requests in 2.7 seconds compared to 27.2 seconds of the CPU implementation. We also tested asynchronous batching, where concurrent requests are batched and sent together as a single request to the system. It was able to process 100 requests in 0.12 seconds which translates to a 225x improvement in processing time.
Using a GPU translated to a 10x speedup without sacrificing accuracy. This change alone improved the responsiveness of the engine considerably.

## Conclusion: Open sourcing Kroomsa

While developing Kroomsa, we came across multiple roadblocks at each step that required rigorous research and swift implementation to resolve. Dealing with the issues of scaling, algorithm accuracy, and efficiency exposed us to the state of the art approaches in the field. We collected valuable feedback from our users over a limited period. It gave us confidence in the potential that this approach holds. Due to misalignment with our product stack, we believe that our community can make better use of it than us at this point, and hence we have decided to open-source the entire project [here](https://github.com/wingify/kroomsa).

## Useful resources

* [How search Algorithms work: Google](https://www.google.com/search/howsearchworks/algorithms/)
* [Build a reddit bot - Shantanu Tiwari](https://new.pythonforengineers.com/blog/build-a-reddit-bot-part-1/)