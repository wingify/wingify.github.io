---
layout: post
title: "How we are writing modern Javascript with AngularJs"
excerpt: "How we are writing modern Javascript with AngularJs"
authorslug: pranavjindal999
author: Pranav Jindal
---


<div class="img-wrapper" style="text-align: center;">
    <img width="40%" src="/images/2023/01/angular-sword.jpeg" alt="Angular sword meme">
</div>

## Preface
Writing slick user interfaces has never been so delightful as it is now. You’ve got amazing frameworks, state management patterns that are easy to reason about, development tools, awesome community support, and all the tools around the whole Javascript world. The *Developer Experience (DX)* you get today, no matter what modern stack you choose, is simply great. Features like *compile-time error detection*, *pre-processors*, and *hot-reload* are just taken for granted and undoubtedly cut development time by a large margin.

Unfortunately, not every software product has the advantage of being developed in such an ideal setting. This shiny JS world was just lit by a few stars like *AngularJS* when we started writing the new user interface for VWO which now has evolved into a very large codebase with uncountable features and has been consistently updated and maintained over the years. 

With AngularJS 1.x, we were required to develop our own build system and use custom pre-processors and transpilers to achieve the same capabilities that modern frameworks provide natively. In short, we had to handle the *developer experience* aspect internally, and we have managed to do so quite effectively.

Although AngularJs is too old to be used for any web application today, over time we have learned how to use it in a modern way.

In this blog post, we will discuss how we write modern Javascript along with AngularJS 1.x and discuss some of the key features and tools that we leverage to make development more efficient and maintainable.


## Typescript

Using JavaScript for web-dev is like playing on hardcore-mode.
You've allowed friendly-fire. If you want to shoot yourself in the foot, you can shoot yourself in the foot.
We're not up for that. We love our foot and also want to keep VWO running bug-free and that is why we use Typescript.

Typescript needs no introduction and we started the process of migrating our app codebase to TS around 3 years back, although it wasn’t straightforward as we had been using a lot of legacy patterns like *AMD (asynchronous module definition)* with *requireJS* and a very custom build process that involved *Grunt* and older version of *NodeJs* to build it.

We wanted to use *ES import syntax* with strong types but all we saw was:

<div class="img-wrapper" style="text-align: center;">
    <img width="40%" src="/images/2023/01/define-define.jpg" alt="DEFINE DEFINE EVERYWHERE">
</div>

We analyzed the <a href="https://www.typescriptlang.org/docs/handbook/compiler-options.html" target="_blank">tscompiler options</a> and set the <a target="_blank" href="https://www.typescriptlang.org/tsconfig/#target">target</a> to AMD and wrote a custom process to rename all JS files to TS and applied <a target="_blank" href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#-ts-nocheck-in-typescript-files">`// @ts-nocheck` directive</a> on the top without touching the source code at all. This way the whole team could write TS for new files and writing TS was opt-in for older files.

Although, we had to keep `tsconfig.json` very lenient at the start with compiler options that enforced strict code had to be turned off. New files could be written with the modern ES import syntax and older files could be manually translated.

After some time, we realized that manual translation from AMD to ES would take an eternity to complete, we looked for solutions and luckily found a <a target="_blank" href="https://github.com/facebook/jscodeshift">JScodeshift</a> that could <a target="_blank" href="https://github.com/5to6/5to6-codemod">transform AMD to ES</a>

As time passed by, our team gradually adopted Typescript and leveraged its countless features, resulting in a codebase that is exceptionally type-safe.

For example, the <a target="_blank" href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining">optional chaining operator</a> allows us to access the properties of an object without worrying about whether the object is null or undefined. This can save a lot of time and effort when working with complex objects, as it eliminates the need to check for null or undefined values at every level.

We also wrote *TS decorators* for class methods and they just work wonders for us.
```ts
@memoize({ cacheKeyResolver: JSON.stringify })
@batchify({
	batchKey: 'ids',
	maxBatchCapacity: 10,
	maxWait: 1000
})
@asyncThrottle({ MaxRequestCount: 12, isLIFO: true })
getCampaignsDetails(params: QueryForListParams) {
	return  this.CampaignResource.queryForCampaignsList(null, params);
}
```
We use multiple decorators as shown above which help us separate out the business logics and performance improvements. Not only this helps us maintain the code, but also makes the code easy to follow and **self-documenting**. 


>  **Code is like humor. When you have to explain it, it's bad!** 

Apart from this, we utilize `enums` and the new <a target="_blank" href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator">`satisfies`</a> operator to make **deeply typesafe code.**

```ts
enum SessionPlatform {
	MOBILE = 'mobile',
	TABLET = 'tablet'
}

const  SessionPlatformDetails  = {
	[SessionPlatform.MOBILE]: {
		icon: IconEnum.MOBILE_ICON,
		title: 'Mobile'
	},
	[SessionPlatform.TABLET]: {
		icon: IconEnum.IPAD_ICON,
		title: 'Tablet'
	}
} as const satisfies Record<SessionPlatformSupportedEnum, {
	icon: IconEnum, 
	title: string
}>;
```
<div style="text-align:center; font-size: 12px; margin-bottom: 20px;">
The code as above ensures that if a new <code class="language-text">SessionPlatform</code> is added, the developer never misses adding the details in <code class="language-text">SessionPlatformDetails</code>.
</div>


Recently, we also learnt about writing <a target="_blank" href="https://medium.com/technogise/type-safe-and-exhaustive-switch-statements-aka-pattern-matching-in-typescript-e3febd433a7a">exhaustive switch cases with TS</a> that basically eliminates any missed cases on compile-time itself.


### Async-await support
AngularJs uses it's own `$q` service which is a first-class Promise implementation, but along with that it ensures that angular's digest cycle triggers automatically on promise status change.
This works well until the developer ensures that native `Promise` is NOT used anywhere and only `$q` is used for any async operation, but easily falls apart if they use `async-await` which uses native `Promise` internally and digest cycles are missed.
To mitigate this, we use `target` for TScompiler is `ES5` which transpiles ES5+ code down to ES5 and polyfill the new features with tslib/ts_helpers. The `async-await` code is transpiled down to using Native Promise.
Now that is a small issue as the transpiled code directly depends on global `Promise` and we wanted the transpiled code to use `$q`. To fix this, we did a smart hack, by ensuring the global `Promise` always points to `$q` in the `app.run` block.

```ts
Object.defineProperty(window, 'Promise', {
	get() {
		return $q;
	},
	set() {
		// ignore any other code trying to replace global Promise
	}
});
```
Now, we have complete clean async-await support without worrying about missing digest and no promise-hells 😉.

I can keep on blabbering about how amazing typescript is (because it **really is**), but I'll move on.

## Tuning AngularJS

Everything around AngularJS is legacy now, be it available packages, community support, or answers over stackoverflow.
Over the course of last few years, we upgraded the version of AngularJS in our VWO app from 1.2.x to 1.8.3 (last version of 1.x that Angular team left us with 🥲).
This upgrade also was gradual and version-by-version as we had to go through the complete changelog of AngularJS. We were also at risk of depending on any deprecated undocumented APIs, hence extra care was needed.

However, everything eventually worked and we were running the latest version. We also upgraded few of the other related packages and `@types/angular` package for best typing support from TS.

###  Importable AngularJS services

AngularJS came with it's own dependency injection system because at that time, no particular module system was there in place in browsers. Developers usually used to mess-up the global namespace for code-sharing and hence dependency injection was a welcome move by Angular.
Although, the way it had to be used was cumbersome where developer had to ensure the exact name with order in `$inject` and the order in the method being injected. 
We have moved on from that as we have ES module system in place (thanks to TS) and now we create and export instance of AngularJS services as soon as they get created. 

We've exported all the native angular services like `$http` from a single file named `ngImports`. This basically helps us evade the dependency injection and import services as if another ES module.
Here is how it works:

```ts
/** ngImports.ts */
import * as ng from 'angular';
import app from 'app'; // app is our angular module's instance

app.run(['$injector', ($i: ng.auto.IInjectorService) => {
		$http = $i.get('$http');
		// and so on for every other native service...
	}
]);

export let $http: ng.IHttpService;
```

For our custom services, we have been writing TS classes which create strongly-typed injectables. We export custom services instance from the definition file itself.
Here is an example:

```ts
/** importHelpers.ts */
import * as ng from 'angular';
import app from 'app';

let $injector: ng.auto.IInjectorService;
export function getInjectable<T>(injectable: string, callback: (instance: T) => void) {
	if ($injector) {
		callback($injector.get<T>(injectable));
	} else {
		app.run(['$injector', ($injector: ng.auto.IInjectorService) => {
				callback($injector.get<T>(injectable));
			}
		]);
	}
}


/** CampaignService.ts */
class CampaignService {
	// implementation here...
}

app.service('campaignService', CampaignService);

export let campaignService: CampaignService;
getInjectable<CampaignService>('campaignService', instance => campaignService = instance);

```

In the code above, `campaignService` is the instance of `CampaignService` that becomes directly importable anywhere throughout the codebase without going through the hassles of injection and preserves the type-safety automatically. 

### Component-based and intelligent attribute directives

AngularJS always had the component-based architecture available at hand but under the disguise of isolated scope directives.
In fact, isolated scope directives are much more powerful as you have access to everything, from requiring other controllers up the chain, having access to element using `$element` and the least appreciated feature - Transclusion.

Transclusion is probably the most underrated feature that AngularJs provides. This is basically analogous to *slots* in VueJS. This allows us build components that can take parts of the template as input from the consumer of component, letting us make very generic components that only encapsulate javascript logic, and the styling and the content can be outsourced to consumer.

For example, here we're using our select-box component which handles everything that a select-box should, but along with that, the consumer of component has complete control on how options should look (like icons, tooltips).
This is probably as powerful as any other modern framework.
```html
<vwo-select-box
	options="vm.selectBoxOptions"
	ng-model="vm.ngModelSelectBox">
	<selected-value-slot>
		<span>Selected - {{$slot.option.name}}</span>
		<vwo-icon
		  vwo-dynamic-tooltip-next
		  icon-size="20" 
		  icon-name="icon--info" 
		  class="icon text--highlight">
			  <tooltip-content>
				  This just shows what you have selected. 
				  You have selected '{{$slot.option.name}}'
			  </tooltip-content>
		</vwo-icon>
	</selected-value-slot>
	<option-slot>
		<span>{{$slot.option.name}}</span>
		<vwo-icon
		  vwo-dynamic-tooltip-next
		  icon-size="20" 
		  icon-name="icon--info" 
		  class="icon text--highlight">
			  <tooltip-content>
			    Clicking on this option will select {{$slot.option.name}}
			  </tooltip-content>
		</vwo-icon>
	</option-slot>
</vwo-select-box>
```

Modern frameworks provide a component-only approach to UI development, while AngularJS provides a full flexibility around that and which is taken to the next level with attribute based directives.
Attribute based directives have a complete access to the whole life-cycle of an element and can modify it's behavior at any point of time. We use these directives very frequently to easily add reusable behaviors anywhere we'd want.

For example, there is a very generic requirement to ellipsize texts in limited screen-estate, but along with ellipsizing, it also becomes a requirement to add title for screen-readers or for looking at complete text when hovered. We have been able to encapsulate all of this covering every edge-case in a very simple attribute that would ellipsize wherever required, automatically.

For example:
```html
<span class="Miw(0)" vwo-ellipsize>{{ session.platformName }}</span>
```
We use Mutation Observers, Resize Observers, real-time space availability checks, etc to decide the truncation of text and ensuring the element has title only if truncated. All of this wrapped in a cute-little attribute that we can put anywhere the text could grow. 

See, AngularJS is not so bad after all 😅!

### Hot Module Replacement 

Hot Module Replacement (HMR) is taken for granted these days with such incredible tooling at hand, and with native framework support, it becomes a breeze to develop user interfaces at an incredible pace. The feedback loop is almost friction-less and you get to see things on-screen as you type and save.

<div class="img-wrapper" style="text-align: center;">
    <img width="50%" src="/images/2023/01/laxman-hmr.jpeg" alt="HMR meme">
</div>

HMR is a fancy new thing and wasn't even a feature back then. With our archaic build process using grunt, loading modules using requireJS (AMD) and AngularJS with it's own cluttered dependency injection pattern, HMR was only a dream for us (at least until recently). This was more like looking for a Torque Converter in our stick-shift manual. 

Although, it was need of the hour, as a full-reload of the app on every code change was wasting a lot of time of our developers. 
We started thinking around ways that could refresh the app with updated code in a jiffy without a full-reload.

There were multiple challenges and multiple iterations, but we were able to create a solution. Our latest HMR system streams all your HTML/TS/CSS changes to your browser in less than a second and the repaint is virtually flicker-free.
The system uses multiple nuances of requireJs, AngularJS, TS and DOM along with a lot of intelligent caching and batching to make this possible under a second and flicker-free.

Don't tell, just show? Here you go 🚀:
<div class="img-wrapper" style="text-align: center;">
    <video loop="true" controls="true" muted width="80%" autoplay="true" src="/images/2023/01/hmr-edit.mp4" alt="HMR Video Preview">
</div>

<br>

A detailed blog post around how this system works is on the way. So, stay tuned!

## What's next

We have been evolving our frontend engineering consistently to make it on-par with the new technologies and frameworks emerging all the time and shared some of the key tips and tricks in this post.

<div class="img-wrapper" style="text-align: center;">
    <img width="40%" src="/images/2023/01/tension.jpeg" alt="Tension meme">
    <img width="40%" src="/images/2023/01/tension-sorted.jpeg" alt="Tension sorted meme">
</div>

Despite these advancements, there are still some challenges that we need to overcome, such as build process speed and the need to optimize for performance and actually a new framework. Looking to the future, it's clear that we probably need to move on from AngularJS one day and we already have laid the stepping stones for that.
We're in the process of moving away from our age old grunt to a newer build process (probably using <a target="_blank" href="https://vitejs.dev/">Vite</a>) which will provide us with the latest tooling, faster build and path to upgrade to a modern framework.

We'll share our progress around that in another blog post. 
Till then keep innovating and keep experimenting!

*PS: We're not too far 😉, and already have an alpha ready with Vite 🔥.*
