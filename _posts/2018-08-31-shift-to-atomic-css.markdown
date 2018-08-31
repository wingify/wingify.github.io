---
layout: post
title: Shift to Atomic CSS
excerpt: Shift to Atomic CSS
authorslug: kushagra_gour
author: Kushagra Gour
---

For the past few months, we at Wingify, have been working on making a common platform for different products - so that things get reused across products and re-inventing the wheel doesn't happen. This also has additional benefits like enforcing common good practices across products, easier switching for developer across products and more. As part of the same endeavor, our Frontend team has been working hard on a Design System and a frontend boilerplate app over that. The boilerplate is something which any product at Wingify can simply fork and build a new frontend app, using the reusable components provided by the base Design System. More about the boilerplate and Design System later, but in this post want to specifically talk about a very import part of our Design System - **our CSS**.

## Issues with current CSS

First, why did we even start looking for a new way to write CSS? Previously, we were using a mix of [BEM](http://getbem.com/introduction/) and some helper classes. Occasional classes which belonged to neither of those two categories could be seen in the code base too! 😅 This approach led to the following issues:

- **Naming classes was always a problem** - Often, someone was commenting the pull requests that this class name doesn't make sense and should be changed to something more _"meaningful"_. Finding _"meaningful"_ names is tough!
- **Unused CSS** - Automated tools to detect unused CSS are not very reliable, especially with Single Page Apps. Our CSS kept growing over time and definitely one main reason for that was no one ever cared to remove the unused CSS.
- **Refactoring** - With usual classes, it becomes difficult to refactor with confidence. Because the developer cannot be very sure about the class that they are renaming or removing getting used elsewhere which they are not aware of.

I have also blogged about these issues in detail in [an article here](https://medium.freecodecamp.org/acss-a-dynamic-atomic-css-library-402dff9756e0).

## Evaluating other approaches

Much before starting this mission, we started evaluating various frameworks for writing CSS. Our evaluation was based on following parameters:

- Final output file size
- Rate of growth of file size over time
- Unused CSS handling
- Ease of learning for a new developer
- Ease of maintenance
- Documentation (existing or requirement to create one internally)
- Lintable
- Themable
- Ease of refactoring
- Naming effort involved
- Critical CSS generation

Yeah, lots of parameters. We evaluated very critically 😀. Also, notice that I have kept the end-user performance related parameters on top as that's what mattered most to us.

## The winner - ACSS

We evaluated lots of known frameworks and libraries out there like pure BEM, Tachyons, Styled Components, Vue's scoped CSS, CSS modules. But We found that atomic CSS approach met most of our requirement as mentioned above. Also known as helper/utility classes approach, Atomic CSS requires no naming, documentation would be available if we go with a well-known library, its themable, lintable. Refactoring is also easier as all you need to do is remove classes from your HTML and never touch CSS.

But even in various atomic CSS libraries available out there, we decided to go with [ACSS](https://acss.io/)(I know, the name is little too generic as they call themselves Atomic CSS!).

ACSS comes with very strong benefits which no other library had. You don't write CSS in ACSS, in fact you don't even download a CSS file and used in ACSS. ACSS comes with a tool called [Atomizer](https://github.com/acss-io/atomizer) which detects the use of ACSS classes in your HTML (or any file) and generates the corresponding CSS for those detected classes. Here is a sample HTML you would write with ACSS:

{% highlight html %}
<button class="Bgc(blue) C(white) P(10px) D(ib) Cur(p) Bgc(red):h">
I am a button
</button>
{% endhighlight %}

On top of usual benefits of Atomic CSS approach, ACSS' automatic CSS generation means that we never get a single byte of CSS that we are not using in an app! What we use in HTML, lands in the final CSS file. In fact, ACSS generates such small CSS that it's practically possible to inline your complete CSS - i.e. your complete CSS can become your critical CSS!

We were free from documentation as the only thing a developer needs to write ACSS is their [awesome, searchable reference](https://acss.io/reference). There is also a [VSCode extension](https://github.com/acss-io/vscode-atomizer) which even removes the need for the reference. We were free from naming things of course.

It may seem that a developer might have to write same set of classes repeatedly to create the same things, but that is not true. ACSS or any Atomic CSS approach requires a templating/component system where you can reuse a piece of HTML without duplicating. We use Vue.js to build our small reusable components.

## The end result

We just finished porting a decent size app to our new system and guess what, our CSS reduced from `90 KB` to just `8 KB`! 😱

That is all for this post! I encourage you to go and try out [ACSS](https://acss.io/) with an open mind and see if it solves your current CSS problem if any. We are happy to answer any questions you might have on our new approach, Design System etc. Do comment on this post or tweet them out to our twitter handle 👉🏼 [@wingify_engg](https://twitter.com/wingify_engg).

Bbye!
