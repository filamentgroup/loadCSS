# loadCSS

A pattern for loading CSS asynchronously
[c]2020 @scottjehl, @zachleat [Filament Group, Inc.](https://www.filamentgroup.com/)
Licensed MIT

## Why an ansychronous CSS loader?

Referencing CSS stylesheets with `link[rel=stylesheet]` or `@import` causes browsers to delay page rendering while a stylesheet loads. When loading stylesheets that are not critical to the initial rendering of a page, this blocking behavior is undesirable. The pattern below allows us to fetch and apply CSS asynchronously. If necessary, this repo also offers a separate (and optional) JavaScript function for loading stylesheets dynamically.


## How to use

As a primary pattern, we recommend loading asynchronous CSS like this from HTML:

`<link rel="stylesheet" href="/path/to/my.css" media="print" onload="this.media='all'; this.onload=null;">`

This article explains why this approach is best: https://www.filamentgroup.com/lab/load-css-simpler/

That is probably all you need! But if you want to load a CSS file from a JavaScript function, read on...

## Dynamic CSS loading with the loadCSS function

The [loadCSS.js](https://github.com/filamentgroup/loadCSS/blob/master/src/loadCSS.js) file exposes a global `loadCSS` function that you can call to load CSS files programmatically, if needed. This is handy for cases where you need to dynamically load CSS from script.

``` javascript
loadCSS( "path/to/mystylesheet.css" );
```

The code above will insert a new CSS stylesheet `link` *after* the last stylesheet or script that it finds in the page, and the function will return a reference to that `link` element, should you want to reference it later in your script. Multiple calls to loadCSS will reference CSS files in the order they are called, but keep in mind that they may finish loading in a different order than they were called.

## Function API

The loadCSS function has 3 optional arguments.

- `before`: By default, loadCSS attempts to inject the stylesheet link *after* all CSS and JS in the page. However, if you desire a more specific location in your document, such as before a particular stylesheet link, you can use the `before` argument to specify a particular element to use as an insertion point. Your stylesheet will be inserted *before* the element you specify. For example, here's how that can be done by simply applying an `id` attribute to your `script`.
```html
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
- `attributes`: You can also optionally pass an Object of attribute name/attribute value pairs to set on the stylesheet. This can be used to specify Subresource Integrity attributes:
```javascript
loadCSS( 
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
  null,
  null,
  {
    "crossorigin": "anonymous",
    "integrity": "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
  }
);
```

#### Using with `onload`

Onload event support for `link` elements is spotty in some browsers, so if you need to add an onload callback, include [`onloadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/src/onloadCSS.js) on your page and use the `onloadCSS` function:

```javascript
var stylesheet = loadCSS( "path/to/mystylesheet.css" );
onloadCSS( stylesheet, function() {
	console.log( "Stylesheet has loaded." );
});
```

### Browser Support

The loadCSS patterns attempt to load a css file asynchronously in any JavaScript-capable browser. However, some older browsers such as Internet Explorer 8 and older will block rendering while the stylesheet is loading. This merely means that the stylesheet will load as if you referenced it with an ordinary link element.


# Changes in version 3.0 (no more preload polyfill)

As of version 3.0, we no longer support or include a polyfill for a `rel=preload` markup pattern. This is because we have since determined that the markup pattern described at the top of this readme is simpler and better for performance, while the former preload pattern could sometimes conflict with resource priorities in ways that aren't helpful for loading CSS in a non-blocking way.

To update, you can change your preload markup to [this HTML pattern](https://github.com/filamentgroup/loadCSS/blob/master/README.md#how-to-use) and delete the JS from your build.

Since this change breaks the API from prior versions, we made it a major version bump. That way, if you are still needing to use the now-deprecated preload pattern, you can keep your code pointing at prior versions that are still on NPM, such as version 2.1.0 https://github.com/filamentgroup/loadCSS/releases/tag/v2.1.0


#### Contributions and bug fixes

Both are very much appreciated - especially bug fixes. As for contributions, the goals of this project are to keep things very simple and utilitarian, so if we don't accept a feature addition, it's not necessarily because it's a bad idea. It just may not meet the goals of the project. Thanks!
