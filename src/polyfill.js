/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
/* This file is meant as a standalone workflow for
- testing support for link[rel=preload]
- enabling async CSS loading in browsers that do not support rel=preload
- applying rel preload css once loaded, whether supported or not.
*/
( function( window, document ) {
"use strict";

try {

	// rel=preload supported by browser, nothing to do
	if ( document.createElement( "link" ).relList.supports( "preload" ) ) {
		return;
	}

} catch ( e ) {

	// if an Error was thrown, rel=preload is not supported
	// that is all we need to know, nothing to do

}

// run once at least
findLinksAndBind();

// rerun polyfill on an interval while the page is loading
var run = window.setInterval( findLinksAndBind, 500 );

document.addEventListener( "DOMContentLoaded", pageLoadHandler ); // MODERN
// LEGACY/
if ( window.addEventListener ) {
	window.addEventListener( "load", pageLoadHandler );
} else if ( window.attachEvent ) {
	window.attachEvent( "onload", pageLoadHandler );
} //
// /LEGACY


//


function pageLoadHandler() {
	window.clearInterval( run );

	// one last time to make sure all links are covered
	findLinksAndBind();
}


function findLinksAndBind() {
	var links = document.querySelectorAll( "link[rel=preload][as=style]:not([data-loadcss])" ); // MODERN
	var links = document.getElementsByTagName( "link" ); // LEGACY

	// loop through link elements in DOM
	for ( var i = 0; i < links.length; i++ ) {
		var link = links[ i ];

		// LEGACY/
		// qualify links to those with rel=preload and as=style attrs
		if (
			link.rel !== "preload" ||
			link.getAttribute( "as" ) !== "style" ||
			link.getAttribute( "data-loadcss" )
		) {
			continue;
		} //
		// /LEGACY

		// prevent rerunning on link
		link.setAttribute( "data-loadcss", true );

		// bind listeners to toggle media back
		bindMediaToggle( link );
	}
}


// if preload isn't supported, get an asynchronous load by using a non-matching media attribute
// then change that media back to its intended value on load
function bindMediaToggle( link ) {

	// remember existing media property for final state, default to 'all'
	var finalMedia = link.media || "all";

	// Set rel and non-applicable media type to start an async request
	// note: timeout allows this to happen async to let rendering continue in IE
	setTimeout( loadStylesheet );

	// bind load handlers to enable media
	link.addEventListener( "load", applyStylesheet ); // MODERN

	// LEGACY/
	if ( link.addEventListener ) {
		link.addEventListener( "load", applyStylesheet );
	} else if ( link.attachEvent ) {
		link.attachEvent( "onload", applyStylesheet );
	}

	// also enable media after 3 seconds,
	// which will catch very old browsers (android 2.x, old firefox) that don't support onload on link
	setTimeout( applyStylesheet, 3000 ); //
	// /LEGACY

	function loadStylesheet() {
		link.rel = "stylesheet";
		link.media = "only x";
	}

	function applyStylesheet() {

		// unbind listeners
		link.removeEventListener( "load", applyStylesheet ); // MODERN
		// LEGACY/
		if ( link.addEventListener ) {
			link.removeEventListener( "load", applyStylesheet );
		} else if ( link.attachEvent ) {
			link.detachEvent( "onload", applyStylesheet );
		} //
		// /LEGACY

		// safety net for https://github.com/filamentgroup/loadCSS/issues/262
		link.onload = null;

		// activate for desired media type
		link.media = finalMedia;
	}
}
} )( window, document );
