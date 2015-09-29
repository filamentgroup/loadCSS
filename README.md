# loadCSS

A function for loading CSS asynchronously
[c]2015 @scottjehl, Filament Group, Inc.
Licensed MIT

## Usage

Place the [`loadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/loadCSS.js) inline in the `head` of your page (it can also be included in an external JavaScript file if preferable).

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

By default, loadCSS will inject the new CSS stylesheet *after* the last stylesheet or script in the page. This should retain your CSS cascade as you'd expect.

#### Optional Arguments
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

Onload listener support with `link` elements is spotty, so if you need to add an onload callback, include [`onloadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/onloadCSS.js) on your page and use the `onloadCSS` function:

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


