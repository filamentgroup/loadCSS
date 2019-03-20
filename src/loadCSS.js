/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
( function( window ) { // GLOBAL
"use strict"; // GLOBAL

var loadCSS = function( href, options ) {
	var document = window.document;
	options = options || {};

	var attributes = options.attributes;
	var media = options.media || "all";

	var appendTo = options.appendTo;
	var insertBefore = options.insertBefore;

	// Arguments explained:
	// `href` [REQUIRED] is the URL for your CSS file.
	// `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
	// By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
	// `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
	// `attributes` [OPTIONAL] is the Object of attribute name/attribute value pairs to set on the stylesheet's DOM Element.
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
	// Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
	// Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
	// TODO: this relies on parentNode existing, which is the main problem fixed by document.insertbefore
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
