/*! onloadCSS. (onload callback for onloadCSS) [c]2017 Filament Group, Inc. MIT License */
( function( window ) { // GLOBAL
"use strict"; // GLOBAL

function onloadCSS( ss, callback ) {
	if ( !callback ) {
		return;
	}

	var called;
	function loadEventHandler() {
		if ( called ) {
			return;
		}

		called = true;
		callback.call( ss );
	}

	ss.addEventListener( "load", loadEventHandler ); // MODERN

	// LEGACY/
	if ( ss.addEventListener ) {
		ss.addEventListener( "load", loadEventHandler );
	} else if ( ss.attachEvent ) {
		ss.attachEvent( "onload", loadEventHandler );
	}

	// This code is for browsers that don’t support onload
	// No support for onload (it'll bind but never fire):
	// * Android 4.3 (Samsung Galaxy S4, Browserstack)
	// * Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
	// * Android 2.3 (Pantech Burst P9070)

	// Weak inference target for Android < 4.4
	if ( "isApplicationInstalled" in navigator && "onloadcsslinked" in ss ) {
		ss.onloadcsslinked( loadEventHandler );
	}//
	// /LEGACY
}

window.onloadCSS = onloadCSS; // GLOBAL
} )( typeof global !== "undefined" ? global : this ); // GLOBAL
exports.onloadCSS = onloadCSS; // CJS
export default onloadCSS; // ESM
