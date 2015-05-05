---
layout: post
title: "Q-Directives - A Faster Directive System For Angular.js"
excerpt: Open Sourcing Q-Directives - A Faster Directive System For Angular.js
authorslug: himanshu_kapoor
author: Himanshu Kapoor
---

Performance matters, and an Angular.js developer would especially know it. Several watchers in a digest cycle can often be a bottleneck, and [Angular doesn't recommend having more than 2,000 of them in your application](http://stackoverflow.com/questions/9682092/databinding-in-angularjs).

We are proud to announce [q-directives](/q-directives/), a brand new and fast directive system for Angular.js, that takes the watcher optimization to a whole new level. It was a result of several [jsperf](jsperf.com) tests and Chrome Timeline runs.

<div style="text-align: center;">
	<a href="https://github.com/wingify/q-directives" style="padding: 20px 40px; font-size: 24px;" class="btn btn-primary">Q-Directives on Github</a>
</div>

## Motivation

[VWO](https://app.vwo.com) is single-page application made entirely in Angular.js. When designing a detailed reporting system for campaigns in Angular.js, we faced troubles with rendering large amounts of data using Angular directives. In one of the report pages, the application had registered 15,000+ watchers, especially due to the way `ng-repeat` works.

With q-directives and a revamped directive system, the number of watchers for a `q-repeat` directive (replacement for the `ng-repeat` directive) was brought down to just 1. So whenever the list changes, only one watcher gets fired.

## Performance Benchmarks

Below stats are a rendition of the Chrome (version 37) timeline for the following use case:

A table containing 216 rows repeated by q-repeat. Each row has about 10 columns containing about 50+ Angular directives each (Original). The optimized version has those Angular directives replaced with q-directives, and ng-repeat is replaced by q-repeat.

Data is collected over 5 samples for both Original and Optimized situations.

### Initial table render

#### Original

<a href="images/2015/05/1.png" target="_blank">![graph](images/2015/05/1.png)</a>

#### Optimized

<a href="images/2015/05/2.png" target="_blank">![graph](images/2015/05/2.png)</a>

#### Optimized (+ disabling ngAnimate)

<a href="images/2015/05/3.png" target="_blank">![graph](images/2015/05/3.png)</a>

### Sorting the table

#### Original

<a href="images/2015/05/4.png" target="_blank">![graph](images/2015/05/4.png)</a>

#### Optimized

<a href="images/2015/05/5.png" target="_blank">![graph](images/2015/05/5.png)</a>

<hr>

## Documentation

Head over to [this link](/q-directives/) for a usage documentation and API reference.

## Contributing

If you are interested in contributing to the project, we would love to hear from you. Just [fork the repository](https://github.com/wingify/q-directives/fork) and [submit a pull request](https://github.com/wingify/q-directives/pulls).
