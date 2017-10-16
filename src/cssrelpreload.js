/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
/* This file is meant as a standalone workflow for:
- testing support for link[rel=preload]
- enabling async CSS loading in browsers that do not support rel=preload
- synchronously activating preload stylesheets that have been cached already
*/
(function( w ){
  "use strict";
  // rel=preload feature support test
  function preloadSupported(){
    try {
      return w.document.createElement( "link" ).relList.supports( "preload" );
    } catch (e) {
      return false;
    }
  };

  // function to enable a stylesheet so it applies
  function enableStylesheet( link, media ){
    link.rel = "stylesheet";
    link.media = media;
    // set a localStorage flag
    if( w.localStorage ){
      try {
        w.localStorage[ link.href ] = true;
      } catch( e ){}
    }
  }

  // loop through link elements in DOM
  var links = w.document.getElementsByTagName( "link" );
  for( var i = 0; i < links.length; i++ ){
    var link = links[ i ];
    // qualify links to those with rel=preload and as=style attrs
    if( link.rel === "preload" && link.getAttribute( "as" ) === "style" ){
      // remember existing media attr for ultimate state, or default to 'all'
      var finalMedia = link.media || "all";
      // remember onload attr, if set, to call it later
      var priorOnload = link.onload;
      // if preload isn't supported, get an asynchronous load by using a non-matching media attribute
      // then change that media back to its intended value on load
      link.onload = function(){
        enableStylesheet( link, finalMedia );
        if( priorOnload ){
          priorOnload.call( link );
        }
      };
      // if a localStorage flag claims we've loaded/cached this stylesheet already, enable it synchronously now
      if( w.localStorage && w.localStorage[ link.href ] ){
        return enableStylesheet( link, finalMedia );
      }
      // if preload is not supported, try to load asynchronously by using a non-matching media query
      if( !preloadSupported() ){
        link.media = "x";
        link.rel = "stylesheet";
      }
      // supported or not, set rel=preload to stylesheet after 3 seconds
      setTimeout( function(){
        enableStylesheet(link, finalMedia );
      }, 3000 );
    }
  }
})(this);
