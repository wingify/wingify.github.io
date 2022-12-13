---
layout: post
title: "Why functional programming is needed"
excerpt: "High order functions such as map, filter etc."
authorslug: ganeshgupta
author: Ganesh Gupta
---

# Why functional programming aka FP is needed?

## FP Paradigm
The problem with a completely new programming paradigm isn’t learning a new language. The tricky part is learning to think differently.
Functional programming follows the same conceptual trajectory as object orientation: developed in academia over the last few decades, it has slowly crept into all modern programming languages. Yet just adding new syntax to a language doesn’t inform developers of the best way to leverage this new way of thinking.

Imperative programming often forces you to compel your tasks so that you can fit them all within a single loop, for efficiency. Functional programming via higher-order functions such as map() and filter() allows you to elevate your level of abstraction, seeing problems with better clarity.

Functional languages are sprouting not just on the Java Virtual Machine (JVM), where the two most interesting new languages are Scala and Clojure, but on the .NET platform as well, which includes F# as a first-class citizen.

    OO makes code understandable by encapsulating moving parts. FP makes code understandable by minimizing moving parts.
    — Michael Feathers

Object-Oriented Programming (OOP) constructs: encapsulation, scoping, visibility, and other mechanisms exist to exert fine-grained control over who can see and change the state. These mechanisms are referred to as `moving parts`. Rather than build mechanisms to control mutable states, most functional languages try to remove mutable states, a `moving part`. The theory follows that if the language exposes fewer potentially error-prone features, it is less likely for developers to make errors.

In object-oriented imperative programming languages, the units of reuse are classes and the messages they communicate with, captured in a class diagram. The seminal work in that space, Design Patterns: Elements of Reusable Object-Oriented Software (by Erich Gamma et al.), includes at least one
class diagram with each pattern. In the OOP world, developers are encouraged to create unique data structures, with specific operations attached in the form of methods. Functional programming languages don’t try to achieve reuse in quite the same way. In functional programming languages, the preference is for a few key data structures (such as list, set, and map) with highly optimized operations on those data structures. To utilize this machinery, developers pass data structures plus higher-order functions to plug into the machinery, customizing it for a particular use.

## Abstraction
One advantage of leveraging higher-level abstractions is already appearing in the `Clojure` space. Recent clever innovations in Clojure’s libraries have managed to rewrite the map function to be automatically parallelizable, meaning that all map operations get a performance boost without developer intervention.

Imperative programming describes a style of programming modeled as a sequence of commands (imperatives) that modify state. A traditional for loop is an excellent example of the imperative style of programming.
Functional programming describes programs as expressions and transformations, models mathematical formulas, and tries to avoid mutable states. Functional programming languages categorize problems differently than imperative languages. The logical categories (filter, transform, and convert) are represented as functions that implement the low-level transformation but rely on the developer to customize the low-level machinery with a higher-order function.

## Benefits of Higher Level of Abstraction
 - First, it encourages us to categorize problems differently, seeing commonalities. 
 - Second, it allows the run‐time to be more intelligent about optimizations. In some cases, reordering the work stream makes it more efficient (for example, processing fewer items) if it doesn’t change the outcome. 
 - Third, it allows solutions that aren’t possible when the developer is elbow-deep in the details problem.

`Clojure` has a similar drop-in replacement for common collection transformations that makes them seamlessly parallel. Working at a higher level of abstraction allows the runtime to optimize low-level details.

## Memoization
The word memoization was coined by Donald Michie, a British artificial intelligence researcher, to refer to function-level caching for repeating values. Today, memoization is common in functional programming languages, either as a built-in feature or one that’s relatively easy to implement. Functions must be pure for the caching technique to work. A pure function has no side effects: it references no other mutable class fields, doesn’t set any values other than the return value, and relies only on the parameters for input.
Memoization is a feature built into a programming language
that enables the automatic caching of recurring function-return values. In other words, it automatically supplies the code I’ve written in Examples 4-1 and 4-3. Many modern languages support memoization, including Groovy.

## Lazy Evaluation
Lazy evaluation—deferral of expression evaluation for as long as possible is a feature of many functional programming languages. Lazy collections deliver their elements as needed rather than precalculating them, offering several benefits. First, you can defer expensive calculations until they’re needed. Second, you can create infinite collections, which keep delivering elements as long as they keep receiving requests. Third, lazy use of functional concepts such as map and filter enables you to generate more efficient code.

    It is better to have 100 functions operate on one data structure than 10 functions on 10 data structures.
    — Alan Perlis

## FP Data Structures
Functional programming languages approach code reuse differently from object-oriented languages. Object-oriented languages tend to have many data structures with many operations, whereas functional languages exhibit few data structures with many operations.

Most developers labor under the misconception that their job is to take a complex business problem and translate it into a language such as Java. They do that because Java isn’t particularly flexible as a language, forcing you to mold your ideas into the rigid structure already there. But as developers use malleable languages, they see the opportunity to bend the language more toward their problem rather than the problem toward
their language. Languages like `Ruby` with its friendlier-than-mainstream support for domain-specific languages (DSLs) demonstrated that potential. Modern functional languages go even further. `Scala` was designed to accommodate hosting internal DSLs, and all `Lisps` (including Clojure) have unparalleled flexibility in enabling the developer to mold the language to the problem.

# FP Error Handling
In Java, errors are traditionally handled by exceptions and the language’s support for creating and propagating them. But what if structured exception handling didn’t exist? Many functional languages don’t support the exception paradigm, so they must find alternate ways of expressing error conditions. Exceptions violate a couple of premises that most functional languages adhere to. First, they prefer pure functions, which have no side effects. However, throwing an exception is a side effect that causes unusual (exceptional) program flow. Functional languages tend to deal with values, preferring to react to return values that indicate an error rather than interrupt program flow. Functional programs tend toward referential transparency: the calling routine shouldn’t care whether it accesses a value or a function that returns a value. If a function can also throw an exception, it isn’t a safe substitute for a value.

## FP Code Reuse
Functional programmers also want reusable code, but they use different building blocks. Rather than try to create well-known relationships (coupling) between structures, functional programming tries to extract coarse-grained reuse mechanisms—based in part on category theory, a branch of mathematics that defines relationships (morphism) between types of objects. Most applications do things with lists of elements, so a functional approach is to build reuse mechanisms around the idea of lists plus contextualized, portable code. Functional languages rely on first-class functions (functions that can appear anywhere any other language construct can appear) as parameters and return values.

## FP immutability
Functional architectures embrace immutability at the core level, leveraging it as much as possible. Embracing immutability is high on the list of ways to think like a functional programmer.


