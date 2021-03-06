---
layout: post
title: Automated Heatmap Verification E2E using Selenium and Canvas
excerpt: Automated Heatmap Verification E2E
authorslug: sahil_goyal
author: Sahil Goyal
---

Heatmaps record visitor clicks on the live state of your website, which can be used to interpret user behavior on elements like modal boxes, pages behind logins, and dynamic URLs.

<div style="text-align:center; margin: 10px;">
  <img src="/images/2018/04/heatmap.png" style="box-shadow: 2px 2px 10px 1px #aaa">
  <div style="margin: 10px;"><b>VWO Heatmap in action on vwo.com</b></div>
</div>

But here comes a question, how to verify Heatmap E2E using automation? How to check if clicks are being plotted correctly? How to check if there is no data loss while plotting the clicks?

The answer to above questions is [HTML Canvas](https://en.wikipedia.org/wiki/Canvas_element). As VWO heatmaps are rendered on HTML canvas, we decided to leverage that to verify Heatmap E2E as well. The best part of using Canvas is that, it can be integrated easily with your existing Selenium scripts.

## How can Canvas be used for Heatmap Automation?
There are two phases in order to verify if the heatmaps are working or not.

1. The first phase is to plot clicks on the test page and store the clicks co-ordinates. This can be easily done using Selenium.
    ```javascript
    //get elements location from the top of DOM
    element.getLocation().then(function (location) {
        //get elements height and width
        element.getSize().then(function (size) {
            //store element’s center coordinates w.r.t. top left corner of DOM in array    
            clickDataArray.push(new Coordinates(Math.floor(location.x + size.width / 2), Math.floor(location.y + size.height / 2)));
        });
    });   
    ```
    In this function, we are simply finding the center coordinates of an element where we have clicked and storing it in to an array. These stored coordinates would be further used to check if the clicks are plotted using the canvas functions or not.

2. The second phase is to leverage canvas functions and the co-ordinate data stored in order to verify if heatmaps are plotted correctly. We simply check if heatmap canvas is empty and if it is empty, we would not check further.
    ```javascript
    exports.isCanvasEmpty = function () {
        browser.wait(EC.presenceOf(element(by.tagName('canvas'))), 5000);
        return browser.executeScript(function () {
            var canvas = document.getElementsByTagName('canvas')[0];
            var imgWidth = canvas.width || canvas.naturalWidth;
            var imgHeight = canvas.height || canvas.naturalHeight;
            // true if all pixels Alpha equals to zero
            var ctx = canvas.getContext('2d');
            var imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
            //alpha channel is the 4th value in the imageData.data array that’s why we are incrementing it by 4
            for (var i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] !== 0) {
                    return false;
                }
            }
            return true;
        });
    }:
    ```

In this function, we are getting the 2d context of the canvas and then we are iterating over the [image data](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData) to check if [alpha channel](https://en.wikipedia.org/wiki/Alpha_compositing) of all pixel points is greater than zero. Alpha channel is an 8-bit layer in a graphics file format that is used for expressing translucency (transparency), which in turn means that if the value of alpha channel of a pixel is equal to zero, nothing is plotted over that pixel.

If for any pixel the value of alpha channel is greater than zero, this tells us that the canvas is not empty which indeed means clicks are plotted onto the heatmap.

Once we are sure that the canvas is not empty, we can proceed further to check that the clicks are plotted on the canvas at the correct position i.e exactly where we clicked using selenium.
```javascript
exports.checkCanvasPlotting = function (coordinates) {
    'use strict';
    browser.wait(EC.presenceOf(element(by.tagName('canvas'))), 5000);
    return browser.executeScript(
        function () {
            var coord = arguments[0];
            var canvas = document.getElementsByTagName('canvas')[0];
            // true if all pixels Alpha equals to zero
            var ctx = canvas.getContext('2d');
            if (ctx.getImageData(coord.x, coord.y, 1, 1).data[3] === 0) {
                return false;
            }
            return true;
    }, coordinates);
};
```

In this function, we are using the same canvas function to get the imageData and then checking that for all the coordinates where clicks were plotted the value of alpha channel is greater than zero.

The above function can be easily called as below:
```javascript
exports.validateHeatmapPlotting = function (coordinateArray) {
    'use strict';
    for (var i = 0; i < coordinateArray.length; i++) {
        expect(canvasUtils.checkCanvasPlotting(coordinateArray[i])).toBe(true);
    }
};
```


## Conclusion

- Canvas utility functions and selenium can be easily leveraged in order to verify basic heatmap functionality using automation.
- These can be easily extended in order to verify number of clicks on element and also to verify plotting intensity.

Hope this post was a good enough reference to help you write end-to-end automation script for heatmap testing. If you have any questions about this, let us know via comments.
