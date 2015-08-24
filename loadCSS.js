/*!
loadCSS: load a CSS file asynchronously.
[c]2014 @scottjehl, Filament Group, Inc.
Licensed MIT
*/

/* exported loadCSS */
function loadCSS( href, before, media, callback ){
	"use strict";
	// Arguments explained:
	// `href` REQUIRED. The URL for your CSS file.
	// `before` REQUIRED. The element to use as a reference for injecting the <link>.
	// `media` OPTIONAL. Media type or query for the stylesheet. (Will be "all" if not defined)
	// `callback` OPTIONAL. DEPRECATED. A callback bound to the stylesheet's onload handler. Use onloadcssdefined on return object of loadCSS instead.
	var ss = window.document.createElement( "link" );
	var ref = before;
	var sheets = window.document.styleSheets;
	ss.rel = "stylesheet";
	ss.href = href;
	// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
	ss.media = "only x";
	if( callback ) {
		ss.onload = callback;
	}

	// inject link
	ref.parentNode.insertBefore( ss, ref );
	// This function sets the link's media back to `all` so that the stylesheet applies once it loads
	// It is designed to poll until document.styleSheets includes the new sheet.
	ss.onloadcssdefined = function( cb ){
		var defined;
		for( var i = 0; i < sheets.length; i++ ){
			if( sheets[ i ].href && sheets[ i ].href === ss.href ){
				defined = true;
			}
		}
		if( defined ){
			cb();
		} else {
			setTimeout(function() {
				ss.onloadcssdefined( cb );
			});
		}
	};
	ss.onloadcssdefined(function() {
		ss.media = media || "all";
	});
	return ss;
}
