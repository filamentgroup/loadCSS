# loadCSS

A function for loading CSS asynchronously
[c]2014 @scottjehl, Filament Group, Inc.
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

#### Optional Arguments
- By default, your stylesheet will be inserted before the first `script` tag in the DOM (which may be the one shown above). If you need another insert location, use the optional `before` argument to specify a different sibling element. The stylesheet will be inserted before the element you specify.

- You can optionally pass a string to the media argument to set the `media=""` of the stylesheet - the default value is `all`.

#### Using with `onload`

Include [`onloadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/onloadCSS.js) on your page.

``` javascript
function onloadCSS( ss, callback ){ ... }

var stylesheet = loadCSS( "path/to/mystylesheet.css" );
onloadCSS( stylesheet, function() {
	console.log( "Stylesheet has asynchronously loaded." );
});
```

#### Contributions and bug fixes

Both are very much appreciated - especially bug fixes. As for contributions, the goals of this project are to keep things very simple and utilitarian, so if we don't accept a feature addition, it's not necessarily because it's a bad idea. It just may not meet the goals of the project. Thanks!

### Usage Example with Content Fonts

Defeating the Flash of Invisible Text (FOIT) is easy with `loadCSS`. The Flash of Unstyled Text (FOUT) is a feature for progressively rendered web sites—we want our content usable by readers as soon as possible.

``` javascript
// Cut the mustard, choose your own method here—querySelector is an easy one.
if( "querySelector" in win.document ) {

	// test for font-face version to load via Data URI'd CSS
	var fontFile = "/url/to/woff.css",
		ua = window.navigator.userAgent;

	// Android's default browser needs TTF instead of WOFF
	if( ua.indexOf( "Android 4." ) > -1 && ua.indexOf( "like Gecko" ) > -1 && ua.indexOf( "Chrome" ) === -1 ) {
		fontFile = "/url/to/ttf.css";
	}

	// load fonts
	if( fontFile ) {
		loadCSS( fontFile );
	}
}
```

Where `/url/to/woff.css` and `/url/to/ttf.css` contain something like:

``` css
@font-face {
  font-family: My Font Family Name;
  /* Important: Data URI here to prevent FOIT */
  src: url("data:application/x-font-woff;charset=utf-8;base64,...") format("woff");
  font-weight: normal;
  font-style: normal;
}
```
