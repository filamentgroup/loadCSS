# loadCSS

A function for loading CSS asynchronously
[c]2014 @scottjehl, Filament Group, Inc.
Licensed MIT

## Usage

Place the [`loadCSS` function](https://github.com/filamentgroup/loadCSS/blob/master/loadCSS.js) inline in the `head` of your page (it can also be included in an external JavaScript file if preferable). 

Then call it by passing it a stylesheet URL or array of URLs.

``` html
<head>
...
<script>
loadCSS( href, before ){ ... }
// load a file
loadCSS( "path/to/mystylesheet.css" );  
</script>
...
</head>
```

If you call `loadCSS()` without the first parameter, it will attempt to inject the CSS from any `<noscript>` elements with the `loadCSS` class containing `<link>` elements. Very useful for including a fallback for users without Javascript!

``` html
<head>
...
<noscript class="loadCSS"><link rel="stylesheet" href="myStyles.css" media="all"></noscript>
<script>
loadCSS();
</script>
...
</head>
```

By default, your stylesheet will be inserted before the first `script` tag in the DOM (which may be the one shown above). If you need another insert location, use the optional `before` argument to specify a different sibling element. The stylesheet will be inserted before the element you specify.
