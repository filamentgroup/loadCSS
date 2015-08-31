/*!
onloadCSS: adds onload support for asynchronous stylesheets loaded with loadCSS.
[c]2014 @zachleat, Filament Group, Inc.
Licensed MIT
*/
(function(w){
	"use strict";
	/* exported onloadCSS */
	w.onloadCSS = function( ss, callback ) {
		var cb = function(){
			cb = function(){};
			return callback.call( ss );
		};

		if( "addEventListener" in w ){
			ss.addEventListener( "load", function(){
				// Timeout needed until Firefox bug is fixed, just in case callback attempts to set a stylesheet prop https://bugzilla.mozilla.org/show_bug.cgi?id=693725
				setTimeout( cb );
			} );
		}

		// This code is for browsers that don’t support onload, or do support it but do not fire it on stylesheets.
		// No support for onload:
		//	* Android 4.3 (Samsung Galaxy S4, Browserstack)
		//	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
		//	* Android 2.3 (Pantech Burst P9070)
		//	* Safari 4.x
		//	* Safari 5.x
		ss.onloadcssdefined( cb );
	};
}(this));
