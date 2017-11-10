/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
/* This file is meant as a standalone workflow for
- testing support for link[rel=preload]
- enabling async CSS loading in browsers that do not support rel=preload
- applying rel preload css once loaded, whether supported or not.
*/
(function( w ){
  "use strict";
  // rel=preload support test
  if( !w.loadCSS ){
    w.loadCSS = function(){};
  }
  var rp = loadCSS.relpreload = {};
  // rel=preload feature support test
  rp.support = function(){
    try {
      return w.document.createElement( "link" ).relList.supports( "preload" );
    } catch (e) {
      return false;
    }
  };

  // function to enable a stylesheet so it applies
  rp.enableStylesheet = function( link, media ){
    link.rel = "stylesheet";
    link.media = media;
  };

  // loop through link elements in DOM
  rp.poly = function(){
    var links = w.document.getElementsByTagName( "link" );
    for( var i = 0; i < links.length; i++ ){
      var link = links[ i ];
      // qualify links to those with rel=preload and as=style attrs
      if( link.rel === "preload" && link.getAttribute( "as" ) === "style" && !link.getAttribute( "data-loadcss" ) ){
        // remember existing media attr for ultimate state, or default to 'all'
        var finalMedia = link.media || "all";
        // if preload isn't supported, get an asynchronous load by using a non-matching media attribute
        // then change that media back to its intended value on load
        var newOnload = function(){
          rp.enableStylesheet(link, finalMedia );
        }
        if( link.addEventListener ){
          link.addEventListener( "load", newOnload );
        } else if( link.attachEvent ){
          link.attachEvent( "onload", newOnload );
        }
        // if preload is not supported, try to load asynchronously by using a non-matching media query
        if( !rp.support() ){
          link.media = "x";
          link.rel = "stylesheet";
        }
        // supported or not, set rel=preload to stylesheet after 3 seconds
        setTimeout( function(){
          rp.enableStylesheet(link, finalMedia );
        }, 3000 );
        // prevent rerunning on link
        link.setAttribute( "data-loadcss", true );
      }
    }
  };
  rp.poly();
  var run = w.setInterval( rp.poly, 300 );
  if( w.addEventListener ){
    w.addEventListener( "load", function(){
      rp.poly();
      w.clearInterval( run );
    } );
  } else if( w.attachEvent ){
    w.attachEvent( "onload", function(){
      w.clearInterval( run );
    } );
  }
  // commonjs
	if( typeof exports !== "undefined" ){
    exports.loadCSS = loadCSS;
	}
	else {
		w.loadCSS = loadCSS;
	}
}( typeof global !== "undefined" ? global : this ) );
