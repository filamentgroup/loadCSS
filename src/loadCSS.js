/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
( function( window ) { // GLOBAL
"use strict"; // GLOBAL

var document = window.document;

/**
 * @typedef {Object} Options
 *
 * @property {string} [media=all] - the media type or query for the stylesheet
 * @property {Object} [attributes] - attributes to be set on the generated link element
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
	options = options || Object.create( null );


	var attributes = options.attributes || Object.create( null );
	var media = options.media || "all";

	var appendTo = options.appendTo;
	var insertBefore = options.insertBefore;

	if ( !insertBefore && !appendTo ) {
		appendTo = ( document.documentElement.lastChild );
	}


	var stylesheetLink = document.createElement( "link" );

	var linkedStylesheets = document.styleSheets;

	// Set any of the provided attributes to the stylesheet DOM Element.
	for ( var attributeName in attributes ) {
		if ( attributes.hasOwnProperty( attributeName ) ) {
			stylesheetLink.setAttribute( attributeName, attributes[ attributeName ] );
		}
	}

	stylesheetLink.rel = "stylesheet";
	stylesheetLink.href = href;
	var resolvedHref = stylesheetLink.href;

	// temporarily set media to something inapplicable to ensure it'll fetch without blocking render
	stylesheetLink.media = "only x";


	//

	// Inject link
	onBody( function() {
		if ( appendTo ) {
			appendTo.appendChild( stylesheetLink );
		} else {
			insertBefore.parentNode.insertBefore( stylesheetLink, insertBefore );
		}
	} );

	// once loaded, set link's media back to `all` so that the stylesheet applies once it loads
	stylesheetLink.onloadcsslinked = onlink;
	onlink( activateStylesheet );

	return stylesheetLink;

	// A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
	function onlink( loadEventHandler ) {
		var i = linkedStylesheets.length;

		while ( i-- ) {
			if ( linkedStylesheets[ i ].href === resolvedHref ) {
				loadEventHandler();
				return;
			}
		}

		setTimeout( function() {
			onlink( loadEventHandler );
		} );
	};

	function activateStylesheet() {
		stylesheetLink.media = media;
	}
};


// wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
function onBody( cb ) {
	if ( document.body ) {
		return cb();
	}

	setTimeout( function() {
		onBody( cb );
	} );
}

window.loadCSS = loadCSS; // GLOBAL
} )( typeof global !== "undefined" ? global : this ); // GLOBAL
exports.loadCSS = loadCSS; // CJS
export default loadCSS; // ESM
