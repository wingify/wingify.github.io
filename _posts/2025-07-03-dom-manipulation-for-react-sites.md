---
layout: post
title: "VWO Editor: Seamless DOM Manipulations for React-based Websites"
excerpt: "VWO Editor: Seamless DOM Manipulations for React-based Websites"
authorslug: nitish_mittal
author: Nitish Mittal
cover: https://engineering.wingify.com/images/2025/07/dom-manipulation-react-err.png
---

# VWO Editor: Seamless DOM Manipulations for React-based Websites

VWO Editor empowers users to make "what-you-see-is-what-you-get" (WYSIWYG) edits directly on website DOM structures. Historically, this powerful capability posed significant challenges for React-based websites. The core problem stemmed from the editor directly altering the visible web page (the actual DOM), causing a fundamental mismatch with React's internal representation of the page (its Virtual DOM, managed by its Fiber tree). This discrepancy often led to errors when React, during routine state updates or user interactions, encountered outdated or deleted elements in the actual DOM, resulting in broken user experiences and site breakage.

<div style="text-align:center; margin: 20px;">
  <img src="/images/2025/07/dom-manipulation-react-err.png" style="box-shadow: 2px 2px 10px 1px #aaa; border-radius: 4px;">
</div>

## The engineering challenge: Bridging the gap between the real and virtual DOM

Consider a scenario where the VWO editor rearranges an element. If a subsequent user action triggered a React state update, the site would break because React's Virtual DOM still held the original, now incorrect, element positions. The fundamental challenge was to ensure that any direct DOM modification made by the VWO editor was also accurately reflected in React's internal Fiber tree.

## VWO's Innovative solution: Direct fiber control

Our engineering team devised a sophisticated solution for this problem: directly controlling React's internal Fiber architecture. Instead of just altering the visible DOM, VWO's editor now meticulously updates the corresponding React Fiber nodes.
For any DOM node, React maintains a connection to its internal Fiber node, often through a dynamically named property (e.g., __reactFiber$tpe8z9r5ev). VWO leveraged this connection. When the editor performs an operation like Edit HTML (replacing an old DOM node with a new one), it doesn't just swap the elements in the DOM. It also:

- Identifies the Fiber node associated with the old DOM element.
- Updates the stateNode property within that Fiber to point to the newly inserted DOM node.
- Crucially, this update is also applied to the alternate Fiber, which is React's "work-in-progress" tree, ensuring consistency during reconciliation.

Here's a code snippet illustrating how VWO updates the stateNode:

```js
// Assuming 'fiberKey' is dynamically determined (e.g., '__reactFiber$tpe8z9r5ev')
// oldNode[fiberKey] holds the reference to the Fiber associated with the old DOM node.
const fiberToUpdate = oldNode[fiberKey];

// Ensure the fiber exists and update its stateNode to point to the new DOM node.
if (fiberToUpdate) {
    fiberToUpdate.stateNode = newDomNode;

    // Additionally, if React has an 'alternate' fiber (for work-in-progress),
    // its stateNode must also be updated to maintain consistency during reconciliation.
    if (fiberToUpdate.alternate) {
        fiberToUpdate.alternate.stateNode = newDomNode;
    }
}
// Note: newDomNode[fiberKey] = oldNode[fiberKey]; is a crucial step if the new DOM node
// is not a React-managed element initially. This ensures the new DOM node
// correctly points back to its Fiber.
// For a ReplaceWith, the new DOM node might be entirely new to React's world.
// This line ensures it gains the correct Fiber reference.
newDomNode[fiberKey] = oldNode[fiberKey];
```

Similarly, for Rearrange operation, which simply changes an element's position, VWO's solution extends to carefully updating the sibling, child, and return (parent) properties within the relevant Fiber nodes to reflect the element's new position. These changes are also mirrored in the alternate fibers.

Here's a code snippet showing how VWO handles changes in the old position during a Rearrange operation:

``` js
// When an element (nodeFiber) is moved, its previous sibling's 'sibling' pointer
// needs to bypass it and point to its next sibling.
if (nodePrevElementSiblingFiber) {
    nodePrevElementSiblingFiber.sibling = nodeNextElementSiblingFiber;
} else {
    // If there was no previous sibling, the node was the first child.
    // So, the parent's 'child' pointer needs to point to the next sibling.
    nodeParentFiber.child = nodeNextElementSiblingFiber;
}

// Ensure changes are mirrored in the alternate fibers
if (nodePrevElementSiblingFiber && nodePrevElementSiblingFiber.alternate) {
    nodePrevElementSiblingFiber.alternate.sibling = nodeNextElementSiblingFiber;
}
if (nodeParentFiber.alternate) {
    nodeParentFiber.alternate.child = nodeNextElementSiblingFiber;
}
```

And here's how VWO handles changes in the new position:

``` js
// When moving nodeFiber to a new position after targetPreviousElementSiblingFiber:
if (targetPreviousElementSiblingFiber) {
    targetPreviousElementSiblingFiber.sibling = nodeFiber;
} else {
    // If no previous sibling at the target, nodeFiber becomes the first child.
    targetParentFiber.child = nodeFiber;
}
nodeFiber.sibling = targetFiber; // nodeFiber's sibling becomes the target (the element it was moved before)
nodeFiber.return = targetParentFiber; // nodeFiber's parent becomes the target's parent

// Ensure changes are mirrored in the alternate fibers
if (targetPreviousElementSiblingFiber && targetPreviousElementSiblingFiber.alternate) {
    targetPreviousElementSiblingFiber.alternate.sibling = nodeFiber;
}
if (targetParentFiber.alternate) {
    targetParentFiber.alternate.child = nodeFiber;
}
if (nodeFiber.alternate) {
    nodeFiber.alternate.sibling = targetFiber;
    nodeFiber.alternate.return = targetParentFiber;
}
```

## Seamless Optimization: The Power of VWO's React Integration

VWO Editor now seamlessly integrates with React-based websites by intelligently interfacing with React’s internal mechanisms. This advanced engineering ensures safe and reliable DOM modifications, preventing site breakage and preserving application integrity. Users can confidently experiment and optimize experiences without disrupting the underlying React framework. While direct DOM manipulation is generally an anti-pattern in typical React development, it is essential for external WYSIWYG editors. This innovation empowers VWO users to optimize their React websites with confidence and efficiency.
