# loadCSS

A function for loading CSS asynchronously
[c]2014 @scottjehl, Filament Group, Inc.
Licensed MIT

## Usage

Place the [`loadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/loadCSS.js) inline in the `head` of your page (it can also be included in an external JavaScript file if preferable). Add an `ID` attribute to the `script` element containing the `loadCSS` function so that you can use it as a reference for inserting the stylesheet. This allows you to guarantee the placement of your stylesheet in source order.

Then call loadCSS by passing it a stylesheet URL and a reference to the script element:

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

#### Optional Arguments

The first two arguments, `href`, and `before` are required. Additionally, you can specify the following:

- `media`: You can optionally pass a string to the media argument to set the `media=""` of the stylesheet - the default value is `all`.
- `callback` (deprecated): pass an onload callback. Instead of using this callback, we recommend binding an onload handler to the returned `link` element by using the [`onloadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/onloadCSS.js) in this repo.

#### Using with `onload`

Include [`onloadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/onloadCSS.js) on your page.

``` javascript
function onloadCSS( ss, callback ){ ... }

var stylesheet = loadCSS( "path/to/mystylesheet.css" );
onloadCSS( stylesheet, function() {
	console.log( "Stylesheet has asynchronously loaded." );
});
```

### Usage Tips

We typically use `loadCSS` to load CSS files that are non-critical to the first rendering of a site. See the [EnhanceJS project Readme](https://github.com/filamentgroup/enhance#enhancejs) for examples of how we typically use it to improve page loading performance.

The reason this script is sometimes necessary is because there is no native way in HTML (currently at least) to load and apply a CSS file asynchronously. CSS references that use either `link` or `import` will cause browsers to block page rendering by default while their related stylesheet loads.

#### Contributions and bug fixes

Both are very much appreciated - especially bug fixes. As for contributions, the goals of this project are to keep things very simple and utilitarian, so if we don't accept a feature addition, it's not necessarily because it's a bad idea. It just may not meet the goals of the project. Thanks!


