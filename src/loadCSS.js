/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
( function( window ) { // GLOBAL
"use strict"; // GLOBAL

/**
 * @typedef {Object} Options
 *
 * @property {string} [media=all] - the media type or query for the stylesheet
 * @property {Object} attributes - attributes to be set on the generated link element
 * @property {HTMLElement} [appendTo=document.documentElement.lastChild]
 *           - container to append the generated link element to
 * @property {HTMLElement} [insertBefore]
 *           - specific element to insert the link element before, only used if `appendTo` is empty
 */

/**
 * loads CSS asynchronously
 *
 * @param {string} href - the URL to use for the link tag
 * @param {Options} options - options
 */
var loadCSS = function( href, options ) {
	var document = window.document;
	options = options || {};

	var attributes = options.attributes;
	var media = options.media || "all";

	var appendTo = options.appendTo;
	var insertBefore = options.insertBefore;

	var stylesheetLink = document.createElement( "link" );

	if ( !insertBefore && !appendTo ) {
		appendTo = ( document.documentElement.lastChild );
	}

	var sheets = document.styleSheets;

	// Set any of the provided attributes to the stylesheet DOM Element.
	if ( attributes ) {
		for ( var attributeName in attributes ) {
			if ( attributes.hasOwnProperty( attributeName ) ) {
				stylesheetLink.setAttribute( attributeName, attributes[ attributeName ] );
			}
		}
	}
	stylesheetLink.rel = "stylesheet";
	stylesheetLink.href = href;

	// temporarily set media to something inapplicable to ensure it'll fetch without blocking render
	stylesheetLink.media = "only x";

	// wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
	function ready( cb ) {
		if ( document.body ) {
			return cb();
		}
		setTimeout( function() {
			ready( cb );
		} );
	}

	// Inject link
	ready( function() {
		if ( appendTo ) {
			appendTo.appendChild( stylesheetLink );
		} else {
			insertBefore.parentNode.insertBefore( stylesheetLink, insertBefore );
		}
	} );

	// A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
	var onloadcssdefined = function( cb ) {
		var resolvedHref = stylesheetLink.href;
		var i = sheets.length;
		while ( i-- ) {
			if ( sheets[ i ].href === resolvedHref ) {
				return cb();
			}
		}
		setTimeout( function() {
			onloadcssdefined( cb );
		} );
	};

	function loadCB() {
		if ( stylesheetLink.addEventListener ) {
			stylesheetLink.removeEventListener( "load", loadCB );
		}
		stylesheetLink.media = media;
	}

	// once loaded, set link's media back to `all` so that the stylesheet applies once it loads
	if ( stylesheetLink.addEventListener ) {
		stylesheetLink.addEventListener( "load", loadCB );
	}

	stylesheetLink.onloadcssdefined = onloadcssdefined;
	onloadcssdefined( loadCB );
	return stylesheetLink;
};

window.loadCSS = loadCSS; // GLOBAL
exports.loadCSS = loadCSS; // CJS
} )( typeof global !== "undefined" ? global : this ); // GLOBAL

export default loadCSS; // ESM
