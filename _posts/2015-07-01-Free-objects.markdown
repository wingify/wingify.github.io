---
layout: post
title: "Free objects - a generalized interpreter pattern"
excerpt: In which I discuss a generalized, type-safe form of the interpreter pattern.
authorslug: chris_stucchio
author: Chris Stucchio
---


In the [GOF book](http://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612), the [interpreter pattern](https://en.wikipedia.org/wiki/Interpreter_pattern) is probably one of the most poorly described patterns. The interpreter pattern basically consists of building a specialty programming language out of objects in your language, and then interpreting it on the fly. [Greenspun's Tenth Rule](https://en.wikipedia.org/wiki/Greenspun%27s_tenth_rule) describes it as follows:

> Any sufficiently complicated C or Fortran program contains an ad hoc, informally-specified, bug-ridden, slow implementation of half of Common Lisp.

In essence, the interpreter pattern consists of dynamically generating and transmitting code at run time instead of statically generating it at compile time.

However, I believe that modern functional programming provides us some alternatives that provide functionality approaching that of embedding a lisp interpreter in our runtime, but also with some measures of type safety. I'm going to describe Free Objects, and how they can be used as a substitute for an interpreter.

## Algebraic structures

In functional programming, there are a lot of algebraic structures that are used to write programs in a type-safe manner. [Monoids](https://blog.safaribooksonline.com/2013/05/15/monoids-for-programmers-a-scala-example/) are one of the simplest examples - a monoid is a type `T` together with an operation `|+|` and an element `zero[T]` with the following properties:


    a |+| (b |+| c) === (a |+| b) |+| c   //associativity
    a |+| zero === a                      //zero


A type is a monoid if it contains elements which can be added together in an associative way, together with a zero element. A number of common structures form monoids - integers (with `a |+| b = a + b` ), lists (with `a |+| b = a ++ b` ) and strings (with `a |+| b = a + b` ) are all monoids. Monoids are commonly used as data structures to represent logs, for example.

Another algebraic structure is the Boolean Algebra. This is a type `T` with three operations - `&`, `|` and `~`, with a rather larger set of properties:

    a & (b & c) === (a & b) & c
    a | (b | c) === (a | b) | c
    ~~a === a
    a & (b | c) === (a & b) | (a & c)
    a | (b & c) === (a | b) & (a | c)
    a & a === a
    a | a === a
    ...etc...


A boolean algebra also has both a `zero` and `one` element, satisfying `zero & _ === zero`, `zero | x === x`, `one & x === x` and `one | _ === one`. There are many common boolean algebras as well - `Boolean` of course, but also fixed-length bitmaps (with operations interpreted bitwise), functions of type `T => Boolean` (here `f & g = (x => f(x) && g(x))`, etc).

There are quite a few more algebraic structures - monads provide another example. But I'm going to leave the trickier ones for another post.

# Defining a structure

Consider a set of objects in the world (say of type `E`), which a user might wish to define a subset of. The objects have properties which can be defined in various ways. One of the simplest ways to define a subset of objects is a function of type `E => Boolean`. We can define a Boolean algebra on such functions:


    implicit object FunctionalBooleanAlgebra extends Bool[E => Boolean] {
      val one = (x:E) => true
      val zero = (x:E) => true
      def and(x: E => Boolean, y: E => Boolean) = (e:E) => x(e) && y(e)
      def or(x: E => Boolean, y: E => Boolean) = (e:E) => x(e) || y(e)
      def negate(x: E => Boolean) = (e:E) => !x(e)
    }

Then such functions can be combined algebraically and evaluated at a later date:

    def f(e: E) = e.isNotEmpty
    def g(e: E) = e.hasHeavyContents
    ...
    val h: E => Boolean = (f _) & (g _)
    ...
    ...later...
    ...
    if (h(e)) {...}

This works great, up until we need to do something besides simply evaluate the functions. For example, we might need to serialize these functions to a database for later evaluation, or we might need to translate these functions to javascript to be evaluated in the browser.

Because we've chosen a fixed interpretation of our algebra, we lose the flexibility to change the interpretation later on. I.e., structure and interpretation are merged.

# Separating structure from interpretation

For many algebraic structures, there exists a [Free Object](https://en.wikipedia.org/wiki/Free_object) - a version of that algebraic structure which has no interpretation whatsoever.

In programming terms, a Free Object is a [Functor](http://eed3si9n.com/learning-scalaz/Functor.html) with a particular natural transformation. I.e., for any type `T`, there is a type `FreeObj[T]` with the following properties:

1. For any object `t` of type `T`, there is a corresponding object `t.point[FreeObj]` having type `FreeObj[T]`. I.e., objects outside the functor can be lifted into it.
2. Let `X` be another object having the same algebraic structure (e.g., `X` is a monoid, or `X` is a boolean algebra). Then for any function `f: T => X`, there is a natural transformation `nat(f): FreeObj[T] => X` with the properties that a) `nat(f)(t.point) = f(t)` and b) `nat(f)` preserves the structure of the underlying algebra.

Preserving the structure of the underlying algebra is important - this means that for a monoid, `nat(f)(x |+| y) === nat(f)(x) |+| nat(f)(y)` and `nat(f)(zero[FreeMonoid[T]]) === zero[X]`. Similarly, for a boolean algebra, `nat(f)(x & y) === nat(f)(x) & nat(f)(y)` (and similar other formulas). This property of preserving the structure is called *homomorphism*.

The key point about the free object is that it can be used to turn any set into a monoid/boolean algebra/etc, and that no information whatsoever is lost by doing so.

## The natural transformation - lifting functions to interpreters

The function `nat` forms a way of turning an arbitrary function into a homomorphism. Lets consider an example of how we might use it. We'd first define in a purely abstract way the set of predicates a user might have.

    sealed trait EPredicate
    case object F extends EPredicate
    case object G extends EPredicate
    ...


Then we would represent our algebra of predicates via the `FreeBool`:

    type EPred = FreeBool[EPredicate]

We can now combine objects as you'd expect:

    val h = F.point[FreeBool] & G.point[FreeBool]

To actually *evaluate* h, we'd need to translate a `FreeBool[EPredicate]` into a function `E => Boolean`, which can be easily accomplished via the natural transformation:

    val hFunc: (E => Boolean) =
      nat((ep:EPredicate) => ep match {
          case F => ((e:E) => e.isNotEmpty)
          case G => ((e:E) => e.hasHeavyContents)
          ...
      })(h)

Simply by defining the interpretation of each case object (`f`, `g`, ...), we've now obtained a way to actually evaluate some composite object `h`.

Assuming we had a boolean algebra representing javascript functions, we could similarly define a homomorphism from `FreeBool[EPredicate]` into `JavascriptFunctions` simply by defining a function from `EPredicate => JavascriptFunctions`.

Partial evaluation of predicates is also possible. For example, suppose we have information that an object is not empty, but lack information on it's contents:

    val hPartialEvaluation: (FreeBool[EPredicate] => FreeBool[EPredicate]) =
      nat((ep:EPredicate) => ep match {
          case F => one[FreeBool[EPredicate]]
          case x => x
      })

# Other Free Objects

One important free object is the `FreeMonoid`. It turns out that the functor `List[_]` is actually a Free Monoid. This can be shown by defining `nat` for a list:

    def nat[A,B](f: A=>B)(implicit m: Monoid[B]): (List[A] => B) =
      (l: List[A]) => l.map(f).reduce((x,y) => m.append(x,y))

Essentially, the natural transformation consists of taking each element of the list, applying the function `f` to it, and then appending the elements.

A somewhat more interesting free algebra is the `FreeGroup`. A `Group` is a `Monoid`, but with an additional operation - inversion. Inversion - denoted by `~x` - has the important property that for any `x`, `(~x) |+| x = one` and `x |+| (~x) = one`. I.e., appending two elements together can always be undone by appending a new element.

For an example of a group, consider the integers - `x |+| y = x + y`, and `~x = -x`.

The type `FreeGroup[A] then consists essentially of a `List[A]`, with the caveat that `a` and `~a` cannot occur adjacent to each other in the list.

Similarly, a `FreeMonad` is a way of taking any `Functor` and getting an abstract monad out of it. This is implemented [in scalaz](https://github.com/scalaz/scalaz/blob/series/7.2.x/core/src/main/scala/scalaz/Free.scala), so the naming is a little different. Given an object `x: Free[S,A]` (for `S[_]` a `Functor`), `x` has the method `foldMap[M[_]](f: S ~> M)(implicit M: Monad[M]): M[A]`. This method implements the natural transformation. In the language we are using here, we could define `nat` as follows:

    def nat[S,M,A](f: S[A] => M[A])(implicit m: Monad[M]): (Free[S,A] => M[A]) =
      (x:Free[S,A]) => x.foldMap(f)(m)

As an illustrated example of how free monads work, [this article](http://polygonalhell.blogspot.com/2014/12/scalaz-getting-to-grips-free-monad.html) discusses how to represent a Forth-like DSL with the `FreeMonad` and then interpret it via a mapping from `Free => State`.

[Free Monad](http://eed3si9n.com/learning-scalaz/Free+Monad.html).
[Free Monads are Simple](http://underscore.io/blog/posts/2015/04/14/free-monads-are-simple.html)
[Deriving the Free Monad](http://underscore.io/blog/posts/2015/04/23/deriving-the-free-monad.html)
