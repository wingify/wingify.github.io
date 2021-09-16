---
layout: post
title: Handling Shadow DOM in Protractor Tests
excerpt: Custom locator to select web elements residing in Shadow DOMs
authorslug: punit_goswami
author: Punit Goswami
---

### Overview

Shadow DOM has slowly and steadily become an integral part of modern web apps. Before this, the Web platform provided only one way to isolate one chunk of code from another - the iframe. But for most encapsulation requirements, the frames are too heavy and not as allowing. Enter the shadow DOM. Through this a browser can include the subtree of DOM elements into the rendered document, still keeping it separate from the main document's DOM tree.

### The Problem

While our front-end automation tests were working fine under the Protractor-with-Jasmine implementation, handling shadow DOMs was still posing to be an elusive challenge. See, protractor does provide an out-of-the-box selector for handling shadow DOM elements - `deepCSS`. But the truth of the story is that handling of the shadow DOM elements through `deepCSS` is riddled with issues reported but unsolved and fixes suggested but not implemented or merged yet.

### The Solution

So we decided to make a custom locator for handling shadow DOM elements since a lot of elements in our app were implemented through shadow DOM.

Our approach was to traverse the shadow DOM tree as any other tree, from the root to the node, and traverse only that path that matches our desired path, as dictated by the selector path. Keeping a note of the immediate parent of the root node of the shadow tree allows us to map the shadow DOM tree to the main page DOM tree.

```javascript
// split the selector path into degenerate shadow root levels
const selectors = cssSelector.split('::sr');

// handling the case where no CSS selector is provided
if (selectors.length === 0) {
    return [];
}

// attach a shadow DOM tree to the specified element's immediate parent
const shadowDomInUse = document.head.attachShadow;

/**
 * Determines whether the given element is a shadow root
 * @param  {Object} el - web element
 */
const getShadowRoot = function (el) {
    return ((el && shadowDomInUse) ? el.shadowRoot : el);
};
```

It also had to be kept in mind that more than one element could match any given selector path. So the matching elements would be kept in an array. Also, we run this recursively so that we traverse all the matching branches of any given node.

```javascript
/**
 * finds all elements matching the given selector, pushes them in an array
 * @param  {string} selector - CSS selector
 * @param  {Object} targets - Targetted element
 * @param  {boolean} firstTry - Whether this is the first attempt to look for the element at the path
 */
const findAllMatches = function (selector, targets, firstTry) {
    let using, i;
    var matches = [];

    for (i = 0; i < targets.length; ++i) {
        // traverse root level elements in targets, otherwise if not the first pass
        // traverse the nested shadow DOMs in the targets recursively
        using = (firstTry) ? targets[i] : getShadowRoot(targets[i]);
        if (using) {
            if (selector === '') {
                // if the selector is empty push the current element in the matches
                matches.push(using);
            } else {
                // get the node list of elements matching the selector, push it in the matches
                Array.prototype.push.apply(matches, using.querySelectorAll(selector));
            }
        }
    }
    return matches;
};
```

We added this as a custom matcher through the `addLocator()` method provided by Protractor to add custom locators. Making this an exportable module allowed us to import this in the protractor configuration file and then reference the selector in any spec file.

```javascript
/**
 * Adds shadow root locator; enables selection of elements inside shadow DOMs on a page
 */
exports.addShadowRootLocator = function () {
    by.addLocator('css_sr', function (cssSelector, optParentElement) {
        // split the selector path into degenerate shadow root levels
        const selectors = cssSelector.split('::sr');
        // handling the case where no CSS selector is provided
        if (selectors.length === 0) {
            return [];
        }
        // attach a shadow DOM tree to the specified element's immediate parent
        const shadowDomInUse = document.head.attachShadow;
        // determines whether the given element is a shadow root
        const getShadowRoot = function (el) {
            return ((el && shadowDomInUse) ? el.shadowRoot : el);
        };
        // finds all elements matching the given selector, pushes them in an array
        const findAllMatches = function (selector, targets, firstTry) {
            let using, i;
            var matches = [];

            for (i = 0; i < targets.length; ++i) {
                // traverse root level elements in targets, otherwise if not the first pass
                // traverse the nested shadow DOMs in the targets recursively
                using = (firstTry) ? targets[i] : getShadowRoot(targets[i]);
                if (using) {
                    if (selector === '') {
                        // if the selector is empty push the current element in the matches
                        matches.push(using);
                    } else {
                        // get the node list of elements matching the selector, push it in the matches
                        Array.prototype.push.apply(matches, using.querySelectorAll(selector));
                    }
                }
            }
            return matches;
        };
        // invoke for the first pass on immediate children of the immediate parent node
        let matches = findAllMatches(selectors.shift().trim(), [optParentElement || document], true);
        // invoke for the rest of the child nodes if the selector path is not empty and immediate child nodes
        // of the parent node present in matches
        while (selectors.length > 0 && matches.length > 0) {
            matches = findAllMatches(selectors.shift().trim(), matches, false);
        }
        // return array of matches
        return matches;
    });
};
```

Thus now whenever we need to provide a path for some element that resides in the “shadows”, we do it like so:

```javascript
let playerSidebar = element(by.css_sr('::sr .player-sidebar'));
```

### Takeaways

Making custom solutions for solving limitations or flaws in an existing piece of code is the essence of open-source software development. As Protractor nears its end of support in late 2022, this framework could still be kept alive with such implementations, building on top of the flexibility and reliability that it provides.
