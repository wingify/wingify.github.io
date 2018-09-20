---
layout: post
title: JS13K Games
excerpt: JS13K Games
authorslug: aditya_mishra, punit_gupta
author: Aditya Mishra, Punit Gupta
---

## Introduction:

[Js13kGames](http://js13kgames.com/) is a JavaScript game development competition that is organized every year, starting from 13th August. Although there are a lot of gaming competitions that are organized every year, what makes this one stand apart is the game size limit of 13 kilobytes. Yes, Just 13KB for everything! code, images, graphics, sound etc. Also, a theme is decided every year and the game ideally should be based on that. This results in lot of brainstorming and innovative ideas & for this year, the theme was 'offline'.

The competition is organized by [Andrzej Mazur](https://twitter.com/end3r) who is also one of the judges. They play each game at the end of the competition and give their reviews in terms of what went right & in what directions improvements could be made. Needless to say, there are a lot of prizes like gadgets, t-shirts and stickers to be won every year.

## Preparations

The competition was on till 13th September. 3 weeks before that, we had a meeting where we discussed the rules & theme of the competition, basic techniques related to game development, & tools that might come handy along the way. We were a little short on time considering that we had to first come up with feasible concepts & our primary experience being Frontend SPA development, creating these games was about to be unlike any code we professionally write. 

## Entries

### [Twisty Polyhedra](http://js13kgames.com/entries/twisty-polyhedra)

The concept behind this one was simple, You will have access to Rubik's cube variants of different sizes & shapes to solve. You're likely familiar with the standard size 3 Rubik's cube, what you may not be aware of is that it's actually just one item from a huge family of puzzles with rich mathematical structures. This game was to be built so that it can at least support face turning Tetrahedra & Octahedra apart from the standard cubes.

![](/images/2018/09/twisty-polyhedra.gif)

Some of the fun challenges involved with this one were:
* Composing & rendering the shape
* Re-orienting & twisting the puzzle according to cursor movements
* Animating the twists

There was a lot to learn from these challenges as it involved playing with vectors, coming up with algorithms to generate & render the sliced shapes on a 2D canvas, to infer the desired action from simple input events etc.


### [Keep-Alive](https://js13kgames.com/entries/keep-alive)

The idea of this game is inspired by ‘Duet’. Although the gameplay is based on the classic game it offers an extended features and new visuals. There are 3 self-contained levels each with a unique challenge. The player rotates coloured orbs in a circular track, guiding the orbs to avoid incoming obstacles. It's required to keep all the orbs intact to keep going & the orbs only collide with obstacles of different color than them & pass unharmed through obstacles otherwise.

![](/images/2018/09/keep-alive.gif)

A few of the interesting challenges with this were:
* Collision detection & revert effects
* Special effects for tail & kill effects
* Dynamic level defintions

Since a lot of these effects were algorithmically generated, size limit was not a concern for this entry. The primary learning experience here was integrating deterministic dynamic stages, cool effects & structuring the implementation.


### [Anti_Virus](https://js13kgames.com/entries/antivirus)

The idea of this game was inspired from a classic game 'snow bros' but with a very different flavour. We all use various offline storage devices to save our precious data. But inevitably, sometimes the data gets corrupted due to viruses. The goal in this game is to go into those devices, kill those viruses and save the data. The gameplay involves moving around, climbing the platforms, freezing the opponents and throwing them over other enemies.

TODO: insert GIF

Some of the major challenges involved with this idea are:
* Detecting collisions among platforms, walls, opponents, shooters and player.
* Randomizing enemy movements.
* Animating when player or enemies are killed.

The physics & special effects being the most fun part of implementation, Squeezing all these things into the required size & keeping gameplay smooth also involved quite a lot of optimizations & polishing.


## [Sum It Up](https://js13kgames.com/entries/sum-it-up)

This game is inspired from one of the most popular games of all time, ‘spider solitaire’. In this one, you don’t have to stack the cards in increasing order. Instead, numbers are written on these cards and you have to stack identical cards over each other causing them to merge into a new card with double value. Your goal is to create the highest score possible.

TODO: insert GIF

The most fun parts of this implementation was creating smooth & beautiful animations.


### [Up & Down](https://js13kgames.com/entries/up-down)

Inspired by vvvvvv, this game is based on playing with gravity. Apart from the ability to move left/right, you can toggle the direction of the pull. On the click of a button, this direction can be flipped upside-down. This basic idea, combined with adding obstacles in creative ways can lead to plenty of possibilities for a platformer.

![](/images/2018/09/up&down.gif)

This involved problems like:
* Implementing smooth discrete integration that provides a nice balanced difficulty
* Collision detection that properly counters changing gravity
* Creating a well structured design to allow for easy extensions to stage definitions

Although created in a very short amount of time, not only were these things fun to solve, these simple problems lead the way towards a wide variety of techniques related to mathematical ideas & design principes in general.


### [Robo Galactic Shooter](https://js13kgames.com/entries/robo-galactic-shooter)

The idea for this entry was to create a classic 2D Shoot'em up style & nostalgic retro feel. You need to survive a barrage of asteroids for as long as possible, the good thing is that you're given some solid guns! The robot is flying towards the right into the coming Asteroids of different sizes. The gameplay involes either dodging them or shooting them till they disintegrate.

TODO: insert GIF

Plenty of effort went into the following parts:
* Creating cool background effects, handling sprites
* Integrating sound effects
* Boundless level generation

Considering how many effects & elements were integrated, there were a lot of optimizations to be made here to fit it all in 13KB. The game also incorporated sound effects using a micro-library called jsfxr. 



## What we Learned

A lot of what we learned came from implementing animations, physics, collision detections etc. It's nice to see how ideas from geometry & basic numerical integration techniques come together to make a functional game. It's also worth mentioning that given how complex the implementations of these simple concepts tend to become, an understanding of software design principles is not only a requirement while building these things, but grows really well with such an experience.

Most of the integrated effects & animations we had to create on our own. Some of our games also involved a degree of focus on keeping the algorithms fast, for example, by managing object life cycles to keep the computations limited to only visible entities, by using clever little hacks to avoid redundant computations while rendering etc.

In the instances where third party libraries were used, we had to make sure they introduced very little overhead. 2 of the listed games leveraged Kontra.js, a micro-library to get up & running quickly without introducing any significant impact to build size. Kontra.js provides nice features such as sprite management & out of the box collision detection etc. Galactic Shooter also used a slightly altered version of jsfxr, a lightweight sound generation library.

For the build process, almost all of us followed a different path. In small games, webpack was suitable for bundling the source. For some larger ones, we wanted to avoid even the tiniest of the overhead introduced by webpack. There we used simple Grunt/Gulp tasks to concatenate & minify files.
In some cases we even avoided using closure compiler, as arrow functions & classes result in much more concise code. Apart from these we experimented with various compression tools & techniques for fitting all those JS/HTML/CSS/PNG files in 13K size limit. But one way or another, we managed to make it for all of the entries.


## Conclusion

This event was not something of business value but proved to be an amazing experience not only in terms of what we learned from it, but also in how much fun we had while implementing these concepts. After all, game development is as fun as it gets when it comes to programming - creating a tiny universe of your own, the laws of physics are what you want them to be, things evolve how you tell them to. And we certainly managed to pick up some nice ideas along the way.
