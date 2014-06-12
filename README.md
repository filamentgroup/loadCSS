# loadCSS

A function for loading CSS asynchronously
[c]2014 @scottjehl, Filament Group, Inc.
Licensed MIT


## Arguments 

- `href` is the optional URL or array of URLs for your CSS file(s).
- `before` optionally defines the element we'll use as a reference for injecting our `<link>`
		By default, `before` uses the first `<script>` element in the page.
		However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
		If so, pass a different reference element to the `before` argument and it'll insert before that instead

- `media` is the value for the `<link>`'s media attribute. Default is "all" or if using the <noscript> option, whatever the original's attribute is.


## Usage

Place the [`loadCSS` function](https://github.com/shshaw/loadCSS/blob/master/loadCSS.min.js) inline in the `head` of your page (it can also be included in an external JavaScript file if preferable). 

### With `<noscript>` Fallback
If you call `loadCSS()` without the first parameter, it will attempt to inject the CSS from any `<noscript>` elements with the `loadCSS` class containing `<link>` elements. Very useful for including a fallback for users without Javascript!

``` html
<head>
...
<noscript class="loadCSS">
  <link rel="stylesheet" href="myStyles.css" media="all">
</noscript>
<script>
  loadCSS();
</script>
...
</head>
```

### Individual files
Call it by passing it a stylesheet URL or array of URLs.

``` html
<head>
...
<script>
  // load one file
  loadCSS( "path/to/mystylesheet.css" );  

  // load multiple files
  loadCSS( ["path/to/moreStyles.css", "path/to/anotherStylesheet.css"] ); 
</script>
...
</head>
```

### Insertion Point
By default, your stylesheet will be inserted before the first `<script>` tag in the DOM (which may be the one shown above). If you need another insert location, use the optional `before` argument to specify a different sibling element. The stylesheet will be inserted before the element you specify.

``` html
<head>
...
<script>
  // load one file and insert before the first <link> element
  var before = document.getElementsByTagName("link")[0];
  loadCSS( "path/to/extraStyles.css", before );  
</script>
...
</head>
```

### `media` Attribute Override

You can optionally pass a string to the media argument to set the media="" of the stylesheet.  The default value is "all" or if using the `<noscript>` option, whatever the original's attribute is.
``` html
<head>
...
<script>
  // load one file and insert before the first <link> element
  var before = document.getElementsByTagName("link")[0];
  loadCSS( "path/to/extraStyles.css", before );  
  
  // Override `media` attribute from all
  loadCSS( "path/to/printStyles.css", before, "print" );  
</script>
...
</head>
```

