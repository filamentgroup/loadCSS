# loadCSS

A function for loading CSS asynchronously
[c]2016 @scottjehl, [Filament Group, Inc.](https://www.filamentgroup.com/)
Licensed MIT

## Why loadCSS?

Referencing CSS files with `link[rel=stylesheet]` or `@import` will cause most browsers to delay page rendering while the stylesheet loads. This is desirable in many cases, but when loading stylesheets that are not critical to the initial rendering of a page, loadCSS (and upcoming web standards mentioned below) allows you to load stylesheets asynchronously, so they don’t block page rendering.

## Basic Usage

With the [`loadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/src/loadCSS.js) referenced in your page, simply call the `loadCSS` function and pass it a stylesheet URL:

```css
loadCSS( "path/to/mystylesheet.css" );
```

The code above will insert a new CSS stylesheet `link` *after* the last stylesheet or script that loadCSS finds in the page, and the function will return a reference to that `link` element, should you want to use it later in your script. Multiple calls to loadCSS will reference CSS files in the order they are called, but keep in mind that they may finish loading in a different order than they were called depending on network conditions.

## Recommended Usage Pattern

Browsers are beginning to support a standard markup pattern for loading CSS (and other file types) asynchronously: `<link rel="preload">` ([W3C Spec](https://www.w3.org/TR/2015/WD-preload-20150721/)). We recommend using this markup pattern to reference any CSS files that should be loaded asynchronously, and using `loadCSS` to polyfill support browsers that don't yet support this new feature.

The markup for referencing your CSS file looks like this:

```html
<link rel="preload" href="path/to/mystylesheet.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="path/to/mystylesheet.css"></noscript>
```

Since `rel=preload` does not apply the CSS on its own (it merely fetches it), there is an `onload` handler on the `link` that will do that for us as soon as the CSS finishes loading. Since this step requires JavaScript, you may want to include an ordinary reference to your CSS file as well, using a `noscript` element to ensure it only applies in non-JavaScript settings.

With that markup in the `head` of your page, include the [loadCSS script](https://github.com/filamentgroup/loadCSS/blob/master/src/onloadCSS.js), as well as the [loadCSS rel=preload polyfill script](https://github.com/filamentgroup/loadCSS/blob/master/src/cssrelpreload.js) in your page (inline to run right away, or in an external file if the CSS is low-priority).

No further configuration is needed, as these scripts will automatically detect if the browsers supports `rel=preload`, and if it does not, they will find CSS files referenced in the DOM and preload them using loadCSS. In browsers that natively support `rel=preload`, these scripts will do nothing, allowing the browser to load and apply the asynchronous CSS (note the `onload` attribute above, which is there to set the `link`'s `rel` attribute to stylesheet once it finishes loading in browsers that support `rel=preload`).

Note: regardless of whether the browser supports `rel=preload` or not, your CSS file will be referenced from the same spot in the source order as the original `link` element. Keep this in mind, as you may want to place the `link` in a particular location in your `head` element so that the CSS loads with an expected cascade order.

You can view a demo of this `rel=preload` pattern here: http://filamentgroup.github.io/loadCSS/test/preload.html


## Function API

If you're calling loadCSS manually (without the `rel=preload` pattern, the function has 3 optional arguments.

- `before`: By default, loadCSS attempts to inject the stylesheet link *after* all CSS and JS in the page. However, if you desire a more specific location in your document, such as before a particular stylesheet link, you can use the `before` argument to specify a particular element to use as an insertion point. Your stylesheet will be inserted *before* the element you specify. For example, here's how that can be done by simply applying an `id` attribute to your `script`.
	``` html
<head>
...
<script id="loadcss">
  // load a CSS file just before the script element containing this code
  loadCSS( "path/to/mystylesheet.css", document.getElementById("loadcss") );
</script>
...
</head>
```

- `media`: You can optionally pass a string to the media argument to set the `media=""` of the stylesheet - the default value is `all`.

#### Using with `onload`

Onload event support for `link` elements is spotty in some browsers, so if you need to add an onload callback, include [`onloadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/src/onloadCSS.js) on your page and use the `onloadCSS` function:

``` javascript
var stylesheet = loadCSS( "path/to/mystylesheet.css" );
onloadCSS( stylesheet, function() {
	console.log( "Stylesheet has loaded." );
});
```

### Browser Support

loadCSS attempts to load a css file asynchronously in any JavaScript-capable browser. However, some older browsers will block rendering while the stylesheet is loading. This table outlines css loading support and async loading support.

<table>
    <tr>
        <th>Browser</th>
        <th>CSS Loads Successfully</th>
        <th>CSS Loads without Blocking Render</th>
    </tr>
    <tr>
        <th>Chrome Mac (latest and many recent versions)</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
    <tr>
        <th>Firefox Desktop (latest and many recent versions)</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
     <tr>
        <th>Opera Mac (latest and many recent versions)</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
    <tr>
        <th>Safari Mac (latest and many recent versions)</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
    <tr>
        <th>Safari iOS (latest and many recent versions)</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
    <tr>
        <th>Chrome Android 5.x</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
    <tr>
        <th>Chrome Android 4.x</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
     <tr>
        <th>Android Browser 2.3</th>
        <th>Yes</th>
        <th>No</th>
    </tr>
    <tr>
        <th>Kindle Fire HD</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
     <tr>
        <th>Windows Phone IE 8.1</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
     <tr>
        <th>IE 11</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
     <tr>
        <th>IE 10</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
    <tr>
        <th>IE 9</th>
        <th>Yes</th>
        <th>Yes</th>
    </tr>
     <tr>
        <th>IE 8</th>
        <th>Yes</th>
        <th>No</th>
    </tr>
     <tr>
        <th>IE 7</th>
        <th>Yes</th>
        <th>No</th>
    </tr>
     <tr>
        <th>IE 6</th>
        <th>Yes</th>
        <th>No</th>
    </tr>

</table>



### Usage Tips

We typically use `loadCSS` to load CSS files that are non-critical to the initial rendering of a page. See the [EnhanceJS project Readme](https://github.com/filamentgroup/enhance#enhancejs) for examples of how we typically use it to improve page loading performance (note: the newest `rel=preload` pattern is not yet in that readme, but the concepts are the same).


#### Contributions and bug fixes

Both are very much appreciated - especially bug fixes. As for contributions, the goals of this project are to keep things very simple and utilitarian, so if we don't accept a feature addition, it's not necessarily because it's a bad idea. It just may not meet the goals of the project. Thanks!
