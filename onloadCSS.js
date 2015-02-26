/*!
loadCSS: load a CSS file asynchronously.
[c]2014 @zachleat, Filament Group, Inc.
Licensed MIT
*/
function onloadCSS( ss, callback ){
	"use strict";
	// Arguments explained:
	// `ss` is the <link> element you want to add a callback to
	var sheets = window.document.styleSheets;
	var waitForOnload = false;
	var triggered = false;
	var onload = function() {
		if( !triggered ) {
			triggered = true;
		}
		if( callback ) {
			callback();
		}
	};

	ss.onload = onload;

	(function checkLoad( first ){
		var defined;
		for( var i = 0; i < sheets.length; i++ ){
			if( sheets[ i ].href && sheets[ i ].href.indexOf( href ) > -1 ){
				defined = true;
			}
		}

		if( defined ){
			// Gecko adds to document.styleSheets immediately,
			// even before the request is finished. So if this happens
			// we’ll wait for the onload to fire for callbacks.
			if( first ) {
				waitForOnload = true;
			}
			if( !waitForOnload ) {
				onload();
			}
		} else if( !triggered ) {
			setTimeout( checkLoad );
		}
	})();
	return ss;
}