---
layout: post
title: "Why functional programming is needed"
excerpt: "High order functions such as map, filter etc."
authorslug: ganesh_gupta
author: Ganesh Gupta
---

## A Little History

Having a functional approach to a problem does not kick off the adventurous journey of learning a new language, instead, it is
more convoluted in the form of thinking offbeat than usual. Mathematicians and computer science researchers comprehended
functional approach rather late than object orientation but somehow they won the battles and persuaded engineers and
developers in embedding their ideas into the modern classes of programming languages.

The reason why it is adored so much in academia are:
* enhancing visualisation and fine clarity
* fitness to the desired level of abstractions

Language supporting FP is JVM-based, .NET platform-based, JS, Rust, etc.

>All race conditions, deadlock conditions, and concurrent update problems are due to mutable variables.
<cite>Robert C. Martin, Clean Architecture</cite>

## FP Paradigm

The rationalization of the term _moving parts_ is a change of states, more or less, controlling who can make changes to states.
Visibility and accessibility are some of the approaches, OOP provides to safeguard changes. OOP tries to minimize the
mutable states rather than providing levers, switches and buttons to control them.

Researchers believe that fewer potentially error-prone features are in the language, it is less likely for developers
to make errors.

The building block of the functional approach is to have less mutable states.

>Object orientation makes code understandable by encapsulating moving parts. FP makes code understandable by minimizing moving parts.
<cite>Michael Feathers</cite>

## Abstraction

The dependency inversion of the SOLID principle, gave a breakthrough to Clojure language, the `map()` operation gets a
performance boost, parallelize simultaneously to multiple cores.

The idea is to hide low-level details from high-level computations.

Imperative style chips in towards a problem holistically with commands, mutating variables, and producing side effects, e.g
loops. Lessening mutation, piping data through transformers, and letting a stream of events, and data pass through mathematical
formulas is how FP makes its way in solving problems, exposing less and less of what is under the hood.

The programmer only sees high-order functions, completely (not 100% though) unaware of why and how of what going under the carpet.

Some examples are: `array_walk`, `array_filter`, `array_reduce`, etc.

**Benefits of Higher Level of Abstraction**

* abstract mathematical model allows faster experimentation
* processing fewer items if it does not change the outcome
* parallelization and optimizations
* allow run time to be independent of any programmers dependencies

>The psychological profile of a programmer is mostly the ability to shift levels of abstraction, from low level to
high level. To see something in the small and to see something in the large. When you're writing a program,
you're saying, "Add one to the counter," but you know why you're adding one to the counter. You can step back and see
a picture of the way a process is moving. Computer scientists see things simultaneously at the low level and the high level.
<cite>Donald E. Knuth</cite>

## Memoization

Memoization, a relic of Dynamic Programming (DP), is a fancy way of saying **caching repeating values**. Once, it was
way of designing an algorithm, on which an entire category of the algorithm is based, to name a few including
Fibonacci Sequence, Tower of Hanoi and Google's favourite interview problem "Egg Dropping Puzzle".

As computer researchers and scientist engineers embrace FP, Memoization is now a built-in language itself. Not to say,
abstraction plays a role here. Though, for memoization to work, the programmer's functions must be pure.

>A pure function has no side effects: it references no other mutable class fields, does not set any values other than the return value, and relies only on the parameters for input.
<cite>Wikipedia</cite>

Many modern languages support memoization, including `Groovy`, custom packages, and libs are available for other languages
for same.

Here is one example:

        if (array_key_exists($key, $this->cache)) {
            return $this->cache[$key];
        }

        $result = call_user_func($compute);

        $this->cache[$key] = $result;

        return $result;

**Tip**
Memoization is so loved at Wingify that there have been multiple instances where memoization-related technical questions
have been asked.

>When asked, “What are the advantages of writing in a language without side effects?” Simon Peyton Jones, co-creator of Haskell, replied, “You only have to reason about values and not about state. If you give a function the same input, it’ll give you the same output, every time. This has implications for reasoning, for compiling, for parallelism.”
<cite>The book, Masterminds of Programming</cite>

## Lazy Evaluation

Evaluate when needed, is a technique in which the evaluation of an expression is delayed until it is needed.
This can be useful in situations where an expression is computationally expensive to evaluate or where the expression
may not be needed at all.

Lazy evaluation modularises a program as a generator, letting choose appropriate outcome when a large result set is
available as computation.

>Lazy evaluation is a powerful technique for improving the performance of programs. It allows the programmer to define the order in which expressions are evaluated, and to delay the evaluation of expressions until they are needed. This can save computational resources and make code easier to read and understand.
<cite>John Hughes, computer scientist and functional programming researcher</cite>


Here is an example of lazy evaluation:

    // A function that returns a closure (an anonymous function)
    // that returns the result of the expensive operation
    function getLazyResult() {
        return function() {
            return expensiveOperation();
        };
    }

    // The closure is created but the expensiveOperation is not yet executed
    $lazyResult = getLazyResult();

    // The expensiveOperation is only executed when the closure is called
    $result = $lazyResult();


## FP Data Structures

Functional languages expose lesser data structures with many operations in comparison to OOP.

The example below is a functional utility class, and it has only one data item, an array. The trait in class add
a whole bunch of operations on the same array of items.

    class Collection
    {
      use HasFilter, HasMap, HasReduce, HasEach;

      protected $items = [];

      public function __construct($items = null)
      {
          if (is_array($items)) {
              $this->items = $items;
          } else if ($items instanceof Collection) {
              $this->items = $items->items();
          } else {
              $this->items = is_null($items) ? [] : array($items);
          }
      }

Strictly typed languages ask too much from developers, language demands that programmers must transform the problem into
the rigid structure of the language itself, ultimately leading developers in creating more data structures to
accommodate that problem. At least that is how early language is designed and to this point, it seems fair.

The rise of functional language and its support gave developers freedom in terms of language malleability which even
developers have never thought of. Surprised? Ruby's internal DSL using language metaprogramming, gave developers the weapon
of mass problem solving, letting them solve any critical problem in the way they like. It minimizes the need for data
structures at the same time allows developers to adopt any behaviour change.

>It is better to have 100 functions operate on one data structure than 10 functions on 10 data structures.
<cite>Alan Perlis</cite>


## FP Error Handling

OOP languages use built-in exceptions to handle errors and run time issues, but the core philosophy of FP is different when
it comes to disrupting the execution flow. FP stick to referential transparency, meaning errors and exceptions are handled
with the help of returned values.

It can say that when it comes to errors, FP tends to favour the imperative paradigm.

>Error handling in functional programming is typically done through the use of monads, which are structures that allow
us to represent computations that may fail or have side effects. Monads provide a way to abstract away error handling
and side effects, making it easier to reason about and write correct code.
<cite>Haskell Programming from First Principles</cite>


## FP Code Reuse

Every programmer wants reusable code, right? why not functional programmers? But FP uses different building blocks in
problem-solving, and code re-usability becomes a little tricky. So what is the difference? OOP and imperative codes create
a relationship between objects but FP create a relationship between mechanism (actions). These actions can be shared or
re-used.

FP treats functions as first-class entities in language.

>In a programming language, a function is a first-class entity if it can be stored in a variable, passed as an argument
to a function, or returned as a result of a function.
<cite>The C Programming Language</cite>


## FP Immutability

It simply means you cannot change a variable once you assign something to it, sounds contradictory? isn't? Language like
`Erlang` has variable immutability in its core. Less moving parts mean fewer things to think about and hence less
chance of making errors.

Learning immutability is the first thing to think like a functional programmer.


>Immutability is a key concept in software development, as it allows us to write code that is more predictable and
easier to understand. It also has the added benefit of making our programs more scalable and easier to parallelize.
<cite>Introduction to the Art of Programming Using Scala</cite>

## The Takeaway

Find these in code `actions`, `calculations`, and `data`

* turn code into reusable and testable by extracting calculations from actions
* design actions by replacing implicit inputs and outputs with explicit ones
* implementing immutability to make reading data into a calculation


## Popular Functional Languages (source: Wikipedia)

* Clojure (https://clojure.org)
* Elixir (https://elixir-lang.org)
* Swift (https://swift.org)
* Kotlin (https://kotlinlang.org)
* Haskell (https://haskell.org)
* Erlang (https://erlang.org)
* Elm (https://elm-lang.org)
* Scala (https://scala-lang.org)
* F# (https://fsharp.org)
* Rust (https://rust-lang.org)
* PureScript (https://www.purescript.org)
* Racket (https://racket-lang.org)
* Reason (https://reasonml.github.io)
