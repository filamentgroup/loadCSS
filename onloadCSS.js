/*!
onloadCSS: adds onload support for asynchronous stylesheets loaded with loadCSS.
[c]2014 @zachleat, Filament Group, Inc.
Licensed MIT
*/

(function(w){
	"use strict";
	/* exported onloadCSS */
	w.onloadCSS = function( ss, callback ) {
		if( "addEventListener" in w ){
			ss.addEventListener( "load", function(){
				// Timeout needed until Firefox bug is fixed, just in case callback attempts to set a stylesheet prop https://bugzilla.mozilla.org/show_bug.cgi?id=693725
				setTimeout(function(){
					if( callback ){
						callback.call( ss );
						callback = null;
					}
				});
			} );
		}

		// This code is for browsers that don’t support onload, any browser that
		// supports onload should use that instead.
		// No support for onload:
		//	* Android 4.3 (Samsung Galaxy S4, Browserstack)
		//	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
		//	* Android 2.3 (Pantech Burst P9070)

		// Weak inference targets Android < 4.4
		if( "isApplicationInstalled" in w.navigator && "onloadcssdefined" in ss ) {
			ss.onloadcssdefined( callback );
		}
	};
}(this));
