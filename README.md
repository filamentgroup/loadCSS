# loadCSS

A function for loading CSS asynchronously
[c]2015 @scottjehl, Filament Group, Inc.
Licensed MIT

## Usage

Place the [`loadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/src/loadCSS.js) inline in the `head` of your page (it can also be included in an external JavaScript file if preferable).

Then call it by passing it a stylesheet URL:

``` html
<head>
...
<script>
  // include loadCSS here...
  function loadCSS( href, before, media ){ ... }
  // load a file
  loadCSS( "path/to/mystylesheet.css" );
</script>
<noscript><link href="path/to/mystylesheet.css" rel="stylesheet"></noscript>
...
</head>
```

By default, loadCSS will inject the new CSS stylesheet *after* the last stylesheet or script that it finds in the page. Multiple calls to loadCSS will reference CSS files in the order they were called, but they may finish loading in a different order than they were called depending on network conditions.

## Recommended Pattern

Browsers are beginning to support a standard means of loading CSS (and other file types) asynchronously through `<link rel="preload">` ([W3C Spec](https://www.w3.org/TR/2015/WD-preload-20150721/)). We recommend using this markup pattern to reference any CSS files that should be loaded asynchronously, and using `loadCSS` merely to polyfill support browsers that don't yet support this new feature.

The markup for referencing your CSS file looks like this:

```html
<link rel="preload" href="/path/to/my/css.css" as="style" onload="this.rel='stylesheet'">
```

With that in the head of your page, you'll want to include the [loadCSS script](https://github.com/filamentgroup/loadCSS/blob/master/src/onloadCSS.js), as well as the [loadCSS rel=preload polyfill script](https://github.com/filamentgroup/loadCSS/blob/master/src/cssrelpreload.js) in your page (inline or external). No further configuration is needed, as these scripts will automatically find CSS files referenced in the DOM and preload them using loadCSS. In browsers that natively support `rel=preload`, these scripts will simply run feature detect and then do nothing, allowing the browser to load and apply the asynchronous CSS (note the onload attribute above, which is there to set the `link`'s `rel` attribute to stylesheet once it finishes loading in browsers that support rel=preload.

Note: regardless of whether the browser supports rel=preload or not, your CSS file will be referenced from the same spot in the source order as the original `link` element. Keep this in mind, as you may want to place the `link` in a particular location in your `head` element so that the CSS loads with an expected cascade order.


#### Function API

If you're calling loadCSS manually, the function has 3 optional arguments.

- `before`: By default, loadCSS attempts to inject the stylesheet link *after* all CSS and JS in the page. However, if you desire a more specific location in your document, such as before a particular stylesheet link, you can use the `before` argument to specify a particular element to use as an insertion point. Your stylesheet will be inserted *before* the element you specify. For example, here's how that can be done by simply applying an `id` attribute to your `script`.
	``` html
<head>
...
<script id="loadcss">
  // include loadCSS here...
  function loadCSS( href, before, media ){ ... }
  // load a file
  loadCSS( "path/to/mystylesheet.css", document.getElementById("loadcss") );
</script>
<noscript><link href="path/to/mystylesheet.css" rel="stylesheet"></noscript>
...
</head>
```

- `media`: You can optionally pass a string to the media argument to set the `media=""` of the stylesheet - the default value is `all`.

#### Using with `onload`

Onload listener support with `link` elements is spotty, so if you need to add an onload callback, include [`onloadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/src/onloadCSS.js) on your page and use the `onloadCSS` function:

``` javascript
function onloadCSS( ss, callback ){ ... }

var stylesheet = loadCSS( "path/to/mystylesheet.css" );
onloadCSS( stylesheet, function() {
	console.log( "Stylesheet has asynchronously loaded." );
});
```

### Browser Support

LoadCSS attempts to load a css file asynchronously, while maintaining the CSS cascade, in any JavaScript-capable browser. However, some older browsers will block rendering while the stylesheet is loading. This table outlines css loading support and async loading support.

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

We typically use `loadCSS` to load CSS files that are non-critical to the initial rendering of a site. See the [EnhanceJS project Readme](https://github.com/filamentgroup/enhance#enhancejs) for examples of how we typically use it to improve page loading performance.

The reason this script is sometimes necessary is because there is no cross-browser means in HTML (currently at least) to load and apply a CSS file asynchronously. CSS references that use either `link` or `import` will cause browsers to block page rendering by default while their related stylesheet loads.

#### Contributions and bug fixes

Both are very much appreciated - especially bug fixes. As for contributions, the goals of this project are to keep things very simple and utilitarian, so if we don't accept a feature addition, it's not necessarily because it's a bad idea. It just may not meet the goals of the project. Thanks!
