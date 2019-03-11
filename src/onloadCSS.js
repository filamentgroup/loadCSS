/*! onloadCSS. (onload callback for loadCSS) [c]2017 Filament Group, Inc. MIT License */
// eslint-disable-next-line no-unused-vars
function onloadCSS( ss, callback ) {
	var called;
	function newcb() {
		if ( !called && callback ) {
			called = true;
			callback.call( ss );
		}
	}

	ss.addEventListener( "load", newcb ); // MODERN

	// LEGACY/
	if ( ss.addEventListener ) {
		ss.addEventListener( "load", newcb );
	} else if ( ss.attachEvent ) {
		ss.attachEvent( "onload", newcb );
	}

	// This code is for browsers that don’t support onload
	// No support for onload (it'll bind but never fire):
	//	* Android 4.3 (Samsung Galaxy S4, Browserstack)
	//	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
	//	* Android 2.3 (Pantech Burst P9070)

	// Weak inference targets Android < 4.4
	if ( "isApplicationInstalled" in navigator && "onloadcssdefined" in ss ) {
		ss.onloadcssdefined( newcb );
	}//
	// /LEGACY
}
