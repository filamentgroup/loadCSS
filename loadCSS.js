/*!
loadCSS: load CSS files asynchronously.
[c]2014 @scottjehl, Filament Group, Inc.
Licensed MIT
*/
function loadCSS( href, before, media ){
	"use strict";
	/*
		How to use:
		- Call `loadCSS("myStyles.css")` or `loadCSS(["myStyles.css","moreStyles.css"])` to load specific CSS files
		- Call `loadCSS()` without the first parameter to inject the CSS from any <noscript> elements with the `loadCSS` class containing <link> elements
				For example: `<noscript class="loadCSS"><link rel="stylesheet" href="myStyles.css" media="all"></noscript>`
				Very useful for including a fallback for users without Javascript!
	
		Arguments explained:
		- `href` is the optional URL or array of URLs for your CSS file(s).
		- `before` optionally defines the element we'll use as a reference for injecting our <link>
				By default, `before` uses the first `<script>` element in the page.
				However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
				If so, pass a different reference element to the `before` argument and it'll insert before that instead
		- `media` is the value for the `<link>`'s media attribute. Default is "all" or if using the `<noscript>` option, whatever the original's attribute is.
	
		Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
	*/
	
	// Create a `<link>` element
	function makeLink(href) {
		var ss = window.document.createElement( "link" );
		ss.rel = "stylesheet";
		ss.href = href;
		return ss;
	}
	
	// Inject `<link>` into DOM
	function injectLink(ss,ref) {
		// Save a reference to the original media attribute, use the `media` argument, or default to "all"
		var ssMedia = ss.media || media || "all";
		// Temporarily, set media to something non-matching to ensure it'll fetch without blocking render
		ss.media = "only x";
		ref.parentNode.insertBefore( ss, ref );
		// Reset original media attribute so that the styleshet applies once it loads
		window.setTimeout(function(){
			ss.media = ssMedia;
		},1);
	}
	
	var ref = before || window.document.getElementsByTagName( "script" )[ 0 ],
			i = 0;
	
	if ( href ) {
		// If `href` is set, add those CSS files
		if ( href instanceof Array ) {
			for (; i < href.length; i++){
				injectLink(makeLink(href[i]),ref);
			}
		} else {
			injectLink(makeLink(href),ref);
		}
	} else {
		// Otherwise, find all `noscript` elements with the class `async-css` and pull any `<link>` elements from there
		var noscripts = window.document.getElementsByTagName("noscript");
	
		if ( noscripts.length ) {
			// Create a dummy element to drop all of the `<noscript>`s contents into to check for `<link>` elements 
			var el = window.document.createElement('div');
			
			for (i = 0; i < noscripts.length; i++ ) {
				// Make sure this `<noscript>` has the `loadCSS` class and has not already been loaded
				if ( ( " "+noscripts[i].className+" ").indexOf(' loadCSS ') > -1 && ( " "+noscripts[i].className+" ").indexOf(' loaded ') === -1 ) {
					el.innerHTML += " " + noscripts[i].innerText;
					noscripts[i].className += " loaded ";
				}
			}
			
			// Extract the `<link>` elements from our dummy element, `el`
			var links = el.getElementsByTagName("link");
			
			for (i = 0; i < links.length; i++ ) {
				// Clone the `<link>` element to prevent issues with skipped elements
				var link = links[i].cloneNode(true);
				injectLink(link,ref);
			}
		}
	}
}
