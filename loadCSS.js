/*!
loadCSS: load a CSS file asynchronously.
[c]2014 @scottjehl, Filament Group, Inc.
Licensed MIT
*/
function loadCSS( href, before, media, callback ){
	"use strict";
	// Arguments explained:
	// `href` is the URL for your CSS file.
	// `before` optionally defines the element we'll use as a reference for injecting our <link>
	// By default, `before` uses the first <script> element in the page.
	// However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
	// If so, pass a different reference element to the `before` argument and it'll insert before that instead
	// note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
	var ss = window.document.createElement( "link" );
	var ref = before || window.document.getElementsByTagName( "script" )[ 0 ];
	var sheets = window.document.styleSheets;
	ss.rel = "stylesheet";
	ss.href = href;
	// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
	ss.media = "only x";
	ss.onload = function() {
		ss.onload = null;
		// Sets the link media back to `all` so that the stylesheet applies once it loads
		ss.media = media || "all";
		if( callback ) {
			callback.call( ss );
		}
	};
	// inject link
	ref.parentNode.insertBefore( ss, ref );

	// This code is for browsers that don’t support onload, any browser that
	// supports onload should use that instead.
	// IE8+, Android 4.4+, Firefox, Chrome, Safari, iOS support onload.
	// Android < 4.4 does not support onload, inference here:
	if( "WebKitAnimationEvent" in window ) {
		(function toggleMedia(){
			// Poll until document.styleSheets includes the new sheet.
			var defined;
			// Note that Gecko and Trident add to document.styleSheets immediately,
			// even before the stylesheet has loaded but we opt-out and use onload there.
			for( var i = 0; i < sheets.length; i++ ){
				if( sheets[ i ].href && sheets[ i ].href.indexOf( ss.href ) > -1 ){
					defined = true;
				}
			}
			if( defined ){
				ss.onload();
			} else {
				setTimeout( toggleMedia );
			}
		})();
	}
	return ss;
}