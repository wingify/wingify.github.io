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

At Wingify, we have several important interpreters floating around in our (currently very experimental) event driven notification system. In this post I'll show how Free Boolean Algebras can drastically simplify the process of defining custom events.

# Algebraic structures

In functional programming, there are a lot of algebraic structures that are used to write programs in a type-safe manner. [Monoids](https://blog.safaribooksonline.com/2013/05/15/monoids-for-programmers-a-scala-example/) are one of the simplest examples - a monoid is a type `T` together with an operation `|+|` and an element `zero[T]` with the following properties:


    a |+| (b |+| c) === (a |+| b) |+| c   //associativity
    a |+| zero === a                      //zero


A type is a monoid if it contains elements which can be added together in an associative way, together with a zero element. A number of common structures form monoids - integers (with `a |+| b = a + b` ) are a simple example. For instance:

    3 + (5 + 7) === (3 + 5) + 7 === 15
    -17 + 0 === -17

But many other data structures also obey this law. Lists and strings, using `|+|` for concatenation and either `[]` or `""` as the zero element, are also monoids. Monoids are commonly used as data structures to represent logs, for example.

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

## Side note: Boolean Algebras are Monoids Too

One of the interesting facts about abstract algebra is that many of these structures interact with each other in interesting ways. For example, any boolean algebra also has *two* monoids built into it. The operations `&` and `one` satisfy the laws of a monoid:

    a & (b & c) === (a & b) & c
    a & one === a

Similarly, the operations `|` and `zero` also satisfy the monoid laws:

    a | (b | c) === (a | b) | c
    a | zero === a

# Event predicates - take one

In our experimental (i.e., you can't use it yet) event based targeting system, I wanted to create an easy way for users to trigger events. I.e., I want to be able to define a formula and evaluate whether it is true or false for some event. E.g.:

    ((EventType == 'pageview') & (url == 'http://www.vwo.com/pricing/'))
       | ((EventType == 'custom') & (custom_event_name == 'pricing_popup_displayed'))

This can be represented in Scala pretty straightforwardly:


    sealed trait EventPredicate {
      def matches(evt: Event): Boolean
      def &(other: EventPredicate) = And(this, other)
      def |(other: EventPRedicate) = Or(this, other)
      ...
    }
    case class EventType(kind: String) extends EventPredicate {
      def matches(evt: Event) = EventLenses.eventType.get(evt) == kind
    }


We also need boolean operators:

    case class And(a: EventPredicate, b: EventPredicate) extends EventPredicate {
      def matches(evt: Event) = a.matches(evt) && b.matches(evt)
    }

    ...etc...


Unfortunately, we have more than one type of predicate. We had quite a few requirements, in fact:

1. We want to compile *some* predicates to Javascript so they can be evaluated browser side.
2. We want to define compound predicates for the convenience of the user. E.g. `GACampaign(utm_source, utm_campaign, ...)` instead of `URLParam("utm_source", "email") & URLParam("utm_campaign", "ilovepuppies") & ...`, but we'd also like to avoid re-implementing in multiple places things like parsing URL params.
3. We actually have multiple types of predicate - `EventPredicate`, `UserPredicate`, `PagePredicate` and we'd like to avoid duplicating code to handle simple boolean algebra stuff. We'd also like to avoid namespace collisions, so we'd need to do `AndEvent`, `AndUser`, etc.
4. We also need to serialize these data structures to JSON, so it would be great if we could not duplicate code around things like serializing `And___`, `Or___`, etc.

The simple object-oriented approach described above doesn't really satisfy all these requirements.

# The Free Boolean Algebra

Ultimately, what I really want to do is the following. I want to define a *set* of objects, e.g.:

    case class EventType(kind: String) extends EventSpec
    case class URLMatch(url: String) extends EventSpec
    ...

Then I want to be able to build a boolean algebra out of them with some sort of simple type constructor. Given
an object created with this type constructor, I then need to be able to make various algebra preserving transformations.

Luckily the field of abstract algebra provides a generic solution to this problem - the [Free Object](https://en.wikipedia.org/wiki/Free_object).
A free object is a version of an algebraic structure which has no interpretation whatsoever - it's a purely symbolic
way of representing that algebra. But the important thing about the free object is that it gives interpretation almost
for free.

More concretely, a Free Object is a [Functor](http://eed3si9n.com/learning-scalaz/Functor.html) with a particular natural transformation. I.e., for any type `T`, there is a type `FreeObj[T]` with the following properties:

1. For any object `t` of type `T`, there is a corresponding object `t.point[FreeObj]` having type `FreeObj[T]`. I.e., objects outside the functor can be lifted into it.
2. Let `X` be another object having the same algebraic structure (e.g., `X` is any boolean algebra). Then for any function `f: T => X`, there is a natural transformation `nat(f): FreeObj[T] => X` with the properties that (a) `nat(f)(t.point) = f(t)` and (b) `nat(f)` preserves the structure of the underlying algebra.

Preserving the structure of the underlying algebra is important - this means that for a boolean algebra, `nat(f)(x & y) === nat(f)(x) & nat(f)(y)`, `nat(f)(x | y) === nat(f)(x) | nat(f)(y)`, etc.This property of preserving the structure is called *homomorphism*.

This bit of mathematics is, in programming terms, the API of our FreeObject. This API allows us to turn any type into a monoid/boolean algebra/etc, and it guarantees that no information whatsoever is lost by doing so.

## How to use it

We've developed a library which includes Free Boolean Algebras called [Old Monk](https://github.com/stucchio/oldmonk). It's named after the [finest rum in the world](https://en.wikipedia.org/wiki/Old_Monk). Old Monk also builds on top of [Spire](https://github.com/non/spire), which provides various abstract algebra type classes in Scala.

To create a simple Boolean algebra for events, we import the following:

    import com.vwo.oldmonk.free._
    implicit val freeBoolAlgebra = FreeBoolListAlgebra //There are multiple variants
    type FreeBool = FreeBoolList
    import spire.algebra._
    import spire.implicits._

We then define our underlying type:

    sealed trait EventSpec
    case class CookieValue(key: String, value: String) extends EventSpec
    ...

Finally, we define the predicate type:

    type EventPredicate = FreeBool[EventSpec]

Combining objects is now straightforward, and uses Spire syntax:

    val pred = CookieValue("foo", "bar").point[FreeBool] | URLParam("_foo", "bar")
    val pred2 = ...
    val pred3 = ~pred & pred2

(There is an implicit in oldmonk which is smart enough to turn the `URLParam` object into an `EventPredicate`, but not smart enough to apply to the first one.)

That's great - we've now got a boolean algebra. But how do we use it?

### Evaluating a predicate

To evaluate a predicate, we need to use the `nat` operation. Recall that the type of `nat` is:

    def nat[T,X](f: T => X): FreeBool[T] => X

So to use this, we simply need to define how our function `f` operates on *individual* `EventSpec` objects:

    def evalEventSpec(evt: Event): (EventSpec => Boolean) = (e:EventSpec) =>
      e match {
        case CookieValue(k, v) => EventLenses.cookie(k).get(evt).getOrElse(false)
        case URLMatches(url) => EventLenses.url.get(evt) == url
        ...
      }

Then by the magic of `nat`, we can evaluate predicates:

    def evaluateEventPredicate(pred: EventPredicate, event: Event): Boolean =
      nat(evalEventSpec(event))(pred)

The logic is that `evalEventSpec(event)` has type `EventSpec => Boolean`. The operation `nat` lifts this to
a function mapping `EventPredicate => Boolean`, and then this function is applied to the actual predicate.

Due to the laws of the Free Boolean Algebra, we know that this method must evaluate things correctly. I.e.,
imagine we had a predicate `a.point[FreeBool] | b.point[FreeBool]`.

By the second law of free Boolean algebras, the homomorphism property, we know that:

    nat(f)(a.point[FreeBool] | b.point[FreeBool]) ===
      nat(f)(a.point[FreeBool]) | nat(f)(b.point[FreeBool])

By the first law, we know that:

    nat(f)(a.point[FreeBool]) === f(a)
    nat(f)(b.point[FreeBool]) === f(b)

Substituting this in yields:

    nat(f)(a.point[FreeBool] | b.point[FreeBool]) ===
      nat(f)(a.point[FreeBool]) | nat(f)(b.point[FreeBool]) ===
      f(a) | f(b)

Thus, the `nat` function has faithfully created a way for us to evaluate our predicates.

### Translating predicates

Consider one of our other requirements - we want to build convenience predicates for the user, but we don't want to duplicate work to evaluate them.

To handle this case, we'd tweak the underlying definition of our predicates a bit:

    sealed trait EventSpec

    sealed trait PrimitiveEventSpec extends EventSpec
    case class CookieValue(key: String, value: String) extends PrimitiveEventSpec
    ...

    sealed trait CompoundEventSpec extends EventSpec
    case class GACampaignMatches(source: String,campaign: String)

We'll approach this problem in two ways. First, we'll build a *translation* layer - a way to translate `FreeBool[EventSpec] => FreeBool[PrimitiveEventSpec]`.
Then we'll build the *evaluation* layer - a way to compute `FreeBool[PrimitiveEventSpec] => Boolean`. With this structure, we only need to
define evaluation on the primitives.

The translation is actually very simple with `nat`. First we define a mapping from `EventSpec => FreeBool[PrimitiveEventSpec]`, and then we use `nat` to lift this function to `FreeBool`:

    def primitivizeSpec(es: EventSpec): FreeBool[PrimitiveEventSpec]) = (es: EventSpec) match {
      case (x: PrimitiveEventSpec) => x.point[FreeBool]
      case (c: CompountEventSpec) => c match {
        case GACampaignMatches(source, campaign) =>
          (URLParam("utm_source", source) : FreeBool[PrimitiveEventSpec]) & (URLParam("utm_campaign", campaign) : FreeBool[PrimitiveEventSpec])
          ...
      }
    }

    val primitivize: FreeBool[EventSpec] => FreeBool[PrimitiveEventSpec] = nat(primitivizeSpec _)

Then we would define evaluation the same as above:

    def evalPrimitiveEventSpec(evt: Event): (EventSpec => Boolean) = (e:EventSpec) =>
      e match {
        case CookieValue(k, v) => EventLenses.cookie(k).get(evt).getOrElse(false)
        case URLMatches(url) => EventLenses.url.get(evt) == url
        ...
      }

    def evaluatePrimitiveEventPredicate(pred: PrimitiveEventPredicate, event: Event): Boolean =
      nat(evalPrimitiveEventSpec(event))(pred)

Finally we would define evaluation as:

    def evaluateEventPredicate(pred: EventPredicate, event: Event): Boolean =
      evaluatePrimitiveEventPredicate(primitivize(pred))

### Partial Evaluation

Another cool trick this approach gives us is partial evaluation. Suppose we gain partial information about a predicate, but it's incomplete.
For instance, we know that `evaluate(a)` should be `True` but we don't know what `evaluate(b)` should be.

Concretely, suppose we have a function:

    def partialEvaluate(e: EventSpec): Option[Boolean] = ...

We can then partially evaluate our predicates:

    def partiallyEvaluatePredicate(e: EventPredicate) =
      nat( (e:EventSpec) => {
        partialEvaluate(e).fold( e )(x => {
          if (x) { True } else { False }
          })
        })


Then, supposing we know `a` to be true but `b` is unknown, this will evaluate to:

    partiallyEvaluatePredicate(a & b) ===
      partialEvaluate(a) & partialEvaluate(b) ===
      True & b ===
      b

This is useful to us in a variety of cases. Often times we'll have a predicate which combines information known server
side, and other information which is only known in the browser. Partial evaluation lets us compute the server side information,
substitute this result in, and have a resulting predicate which depends only on browser-side information.

The browser-side predicate can then be rendered to javascript and evaluated in the browser directly. This is pretty straightforward, in fact:

    def evaluateServerSide(e: ServerSideEventSpec): Boolean = ...

    def browserify(e: EventPredicate): BrowserSideEventPredicate =
      nat( (e:EventSpec) => e match {
          case (b:BrowserSideEventSpec) => b.point[FreeBool] : BrowserSideEventPredicate
          case (s:ServerSideEventSpec) => if (evaluateServerSide(s)) {
             TruePred : BrowserSideEventPredicate
           } else {
             FalsePred : BrowserSideEventPredicate
           }
        }
      )


# Conclusion

Free objects are a great way to build generalized interpreter patterns. Just as the `FreeMonad` (called simply `Free` in Scalaz) enables one to build generalized
stateful computations, abstracting away the actual state, `FreeBool` allows us to build generalized predicates and manipulate them in a straightforward manner.

More generally, if you find yourself re-implementing the same algebraic structure over and over, it might be worth asking yourself if a free version of
that algebraic structure exists. If so, you might save yourself a lot of work by using that.

# Other Free Objects

One important free object is the `FreeMonoid`. It turns out that the functor `List[_]` is actually a Free Monoid. This can be shown by defining `nat` for a list:

    def nat[A,B](f: A=>B)(implicit m: Monoid[B]): (List[A] => B) =
      (l: List[A]) => l.map(f).reduce((x,y) => m.append(x,y))

Essentially, the natural transformation consists of taking each element of the list, applying the function `f` to it, and then appending the elements.

A somewhat more interesting free algebra is the `FreeGroup`. A `Group` is a `Monoid`, but with an additional operation - inversion. Inversion - denoted by `~x` - has the important property that for any `x`, `(~x) |+| x = zero` and `x |+| (~x) = zero`. I.e., appending two elements together can always be undone by appending a new element.

For an example of a group, consider the integers - `x |+| y = x + y`, and `~x = -x`.

The type `FreeGroup[A] then consists essentially of a `List[A]`, with the caveat that `a` and `~a` cannot occur adjacent to each other in the list.

Similarly, a `FreeMonad` is a way of taking any `Functor` and getting an abstract monad out of it. This is implemented [in scalaz](https://github.com/scalaz/scalaz/blob/series/7.2.x/core/src/main/scala/scalaz/Free.scala), so the naming is a little different. Given an object `x: Free[S,A]` (for `S[_]` a `Functor`), `x` has the method `foldMap[M[_]](f: S ~> M)(implicit M: Monad[M]): M[A]`. This method implements the natural transformation. In the language we are using here, we could define `nat` as follows:

    def nat[S,M,A](f: S[A] => M[A])(implicit m: Monad[M]): (Free[S,A] => M[A]) =
      (x:Free[S,A]) => x.foldMap(f)(m)

As an illustrated example of how free monads work, [this article](http://polygonalhell.blogspot.com/2014/12/scalaz-getting-to-grips-free-monad.html) discusses how to represent a Forth-like DSL with the `FreeMonad` and then interpret it via a mapping from `Free => State`.

[Free Monad](http://eed3si9n.com/learning-scalaz/Free+Monad.html).
[Free Monads are Simple](http://underscore.io/blog/posts/2015/04/14/free-monads-are-simple.html)
[Deriving the Free Monad](http://underscore.io/blog/posts/2015/04/23/deriving-the-free-monad.html)
