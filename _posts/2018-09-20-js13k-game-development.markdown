---
layout: post
title: JS13K Games
excerpt: This post describes our experience of the game development competition JS13kGames 2018
authorslug: aditya_mishra_punit_gupta
author: Aditya Mishra, Punit Gupta
---

## Introduction:

[Js13kGames](http://js13kgames.com/) is a JavaScript game development competition that is organized every year from 13th August to 13th September. What makes this one stand apart from other game dev competitions, is the game size limit of 13 kilobytes. Yes, Just 13KB for everything including code, images, graphics, sounds! Moreover, a theme is decided every year and the game ideally should be based on that. This results in a lot of brainstorming and innovative ideas. For this year, the theme was 'offline'.

The competition is organized by [Andrzej Mazur](https://twitter.com/end3r) who is also one of the judges. They play every submitted game at the end of the competition and give their reviews in terms of what went right & in what directions improvements could be made. Needless to say, there are a lot of prizes like gadgets, t-shirts, and stickers to be won every year.

## Preparations

JS13K competition is not new to folks at Wingify. A couple of us have prior experience of this. [Kush](https://twitter.com/chinchang457), [Gaurav](https://twitter.com/gauravmuk) and [Varun](https://twitter.com/s0ftvar) had participated in previous JS13K events. Having experienced the competition first hand, they felt compelled to inform the rest of us as well.

After the first week since the beginning of the competition, we all met and the veterans of this competition introduced us to the rules & theme, basic techniques related to game development, & tools that might be handy along the way. We were a little short on time considering that we had to first come up with feasible concepts & our primary experience being Frontend SPA development, creating these games was about to be unlike any code we professionally write. 

## Entries

### [Twisty Polyhedra](http://js13kgames.com/entries/twisty-polyhedra)

Author: [Aditya Mishra](https://twitter.com/Aditya_r_m)


The concept behind this one is simple, You will have access to Rubik's cube variants of different sizes & shapes to solve. You're likely familiar with the standard size 3 Rubik's cube. But what you may not be aware of is that it's actually just one item from a huge family of puzzles with rich mathematical structures. This game was to be built so that it can at least support face turning Tetrahedra & Octahedra apart from the standard cubes.

<div style="text-align:center;">
  <img src="/images/2018/09/js13k_twisty_polyhedra.gif" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

Some of the fun challenges involved with this one were:
* Composing & rendering the shape
* Re-orienting & twisting the puzzle according to cursor movements
* Animating the twists

There was a lot to learn from these challenges as it involved playing with vectors, coming up with algorithms to generate & render the sliced shapes on a 2D canvas, to infer the desired action from simple input events etc.

[demo](https://js13kgames.com/games/twisty-polyhedra/index.html)
|
[source](https://github.com/aditya-r-m/twisty-polyhedra)


### [Keep-Alive](https://js13kgames.com/entries/keep-alive)

Author: [Surbhi Mahajan](https://twitter.com/surbhi_mahajan)


The idea of this game is inspired by ‘Duet’. Although the gameplay is based on the classic game, it offers extended features and new visuals. There are 3 self-contained levels each with a unique challenge. The player rotates colored orbs in a circular track, guiding them to avoid incoming obstacles. It's required to keep all the orbs intact to keep going. The orbs only collide with obstacles of a different color than them & pass unharmed through obstacles otherwise.

<div style="text-align:center;">
  <img src="/images/2018/09/js13k_keep_alive.gif" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

A few of the interesting challenges with this were:
* Collision detection & revert effects
* Special effects for tail & kill animations
* Dynamic level definitions

Since a lot of these effects were algorithmically generated, the size limit was not a concern for this entry. The primary learning experience here was integrating deterministic dynamic stages, cool effects & structuring the implementation.

[demo](https://js13kgames.com/games/keep-alive/index.html)
|
[source](https://github.com/surbhi-mahajan/keep-alive)


### [Anti_Virus](https://js13kgames.com/entries/antivirus)

Author: [Punit Gupta](https://twitter.com/PunitGu22548112)


This game is inspired by a classic game 'Snow Bros' but with a very different flavor. We all use various offline storage devices to save our precious data. But inevitably, sometimes the data gets corrupted due to viruses. The goal here is to go into those devices, kill those viruses and save the data. The gameplay involves moving around, climbing the platforms, freezing the opponents and throwing them over other enemies.

<div style="text-align:center;">
  <img src="/images/2018/09/js13k_anti_virus.gif" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

Some of the major challenges involved with this idea are:
* Detecting collisions among platforms, walls, opponents, shooters and player.
* Randomizing enemy movements.
* Animating when player or enemies are killed.

The physics & special effects being the most fun part of the implementation, squeezing all these things into the required size & keeping the gameplay smooth also involved quite a lot of optimizations & polishing.

[demo](https://js13kgames.com/games/antivirus/index.html)
|
[source](https://github.com/pntgupta/anti-virus)

## [Sum It Up](https://js13kgames.com/entries/sum-it-up)

Author: [Hemkaran Raghav](https://twitter.com/hemkaranraghav)


This game is inspired by one of the most popular games of all time, ‘Spider Solitaire’. In this one, you don’t have to stack the cards in increasing order. Instead, numbers are written on these cards and you have to stack identical cards over each other causing them to merge into a new card with double value. Your goal is to create the highest score possible.

<div style="text-align:center;">
  <img src="/images/2018/09/js13k_sum_it_up.gif" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

The most fun parts of this implementation were creating smooth & beautiful animations.

[demo](https://js13kgames.com/games/sum-it-up/index.html)
|
[source](https://github.com/hemkaran/sum-it-up-game)


### [Up & Down](https://js13kgames.com/entries/up-down)

Author: [Dinkar Pundir](https://twitter.com/dinkarpundir)


Inspired by vvvvvv, this game is based on playing with gravity. Apart from the ability to move left/right, you can toggle the direction of the pull. On the click of a button, this direction can be flipped upside-down. This basic idea when combined with adding obstacles in creative ways can lead to plenty of possibilities for a platformer.

<div style="text-align:center;">
  <img src="/images/2018/09/js13k_up&down.gif" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

This involved problems like:
* Implementing smooth discrete integration that provides a nice balanced difficulty
* Collision detection that properly counters changing gravity
* Creating a well-structured design to allow for easy extensions to stage definitions

Although created in a very short amount of time, not only were these things fun to solve, these simple problems lead the way towards a wide variety of techniques related to mathematical ideas & design principles in general.

[demo](https://js13kgames.com/games/up-down/index.html)
|
[source](https://github.com/dinkar/up-and-down-js13k-2018)


### [Robo Galactic Shooter](https://js13kgames.com/entries/robo-galactic-shooter)

Author: [Ashish Bardhan](https://twitter.com/CreativeBakchod)


The idea for this entry was to create a classic 2D Shoot'em up style & nostalgic retro feel. You need to survive a barrage of asteroids for as long as possible. The good thing is that you're given some solid guns! The robot is flying towards the right into the coming asteroids of different sizes & velocities. The gameplay involves either dodging them or shooting them till they disintegrate.

<div style="text-align:center;">
  <img src="/images/2018/09/js13k_robo_galactic_shooter.gif" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

Plenty of effort went into the following parts:
* Creating cool background effects, handling sprites
* Integrating sound effects
* Boundless level generation

Considering how many effects & elements were integrated, a lot of optimizations were required to fit it all in 13KB. The game also incorporated sound effects using a micro-library called jsfxr. 

[demo](https://js13kgames.com/games/robo-galactic-shooter/index.html)
|
[source](https://github.com/AshBardhan/robo-galactic-shooter)

## What we Learned

A lot of what we learned came from implementing animations, physics, collision detections etc. It's nice to see how ideas from geometry & basic numerical integration techniques come together to make a functional game. It's also worth mentioning that given how complex the implementations of these simple concepts tend to become, an understanding of software design principles is not only a requirement while building these things, but also grows really well with such an experience.

Most of the integrated effects & animations we had to create on our own. Some of our games also involved a degree of focus on keeping the algorithms fast, for example, by managing object lifecycles to keep the computations limited to only visible entities, by using clever little hacks to avoid redundant computations while rendering etc.

In the instances where third party libraries were used, we had to make sure they introduced very little overhead. 2 of the listed games leveraged [Kontra.js](https://github.com/straker/kontra), a micro-library to get up & running quickly without introducing any significant impact to build size. Kontra.js provides nice features such as sprite management & out of the box collision detection etc. Galactic Shooter also used a slightly altered version of [jsfxr](https://github.com/mneubrand/jsfxr), a lightweight sound generation library.

For the build process, almost all of us followed a different path. In small games, [Webpack](https://webpack.js.org/) was suitable for bundling the source. For some larger ones, we wanted to avoid even the tiniest of the overhead introduced by Webpack. Therefore, we used simple [Grunt](https://gruntjs.com/) / [Gulp](https://gulpjs.com/) tasks to concatenate & minify files.
In some cases, we even avoided using closure compiler, as arrow functions & classes result in much more concise code. Apart from these, we experimented with various compression tools & techniques for fitting all those JS/HTML/CSS/PNG files in 13K size limit. But one way or another, we managed to make it for all of the entries.


## Conclusion

Participation in this event did require committing a significant amount of personal time to it but proved to be an amazing experience not only in terms of what we learned from it but also in how much fun we had while implementing these concepts. After all, game development is as fun as it gets when it comes to programming - **_creating a tiny universe of your own, the laws of physics are what you want them to be, things evolve how you tell them to_**. And we certainly managed to pick up some nice ideas along the way.

We would love to hear your feedback or answer any queries you might have, feel free to drop a comment or tweet us at [@wingify_engg](https://twitter.com/wingify_engg).

### Game on!
