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
...
</head>
```

#### Optional Arguments
- By default, your stylesheet will be inserted before the first `script` tag in the DOM (which may be the one shown above). If you need another insert location, use the optional `before` argument to specify a different sibling element. The stylesheet will be inserted before the element you specify.

- You can optionally pass a string to the media argument to set the `media=""` of the stylesheet - the default value is `all`.


#### Contributions and bug fixes

Both are very much appreciated - especially bug fixes. As for contributions, the goals of this project are to keep things very simple and utilitarian, so if we don't accept a feature addition, it's not necessarily because it's a bad idea. It just may not meet the goals of the project. Thanks!
