/* CSS rel=preload polyfill. Depends on loadCSS function */
(function( w ){
  // rel=preload support test
  function support(){
    try {
      return w.document.createElement("link").relList.supports( "preload" );
    } catch (e) {}
  }
  // loop preload links and fetch using loadCSS
  function poly(){
    var links = w.document.getElementsByTagName( "link" );
    for( var i = 0; i < links.length; i++ ){
      if( links[ i ].getAttribute( "rel" ) === "preload" ){
        w.loadCSS( links[ i ].href, links[ i ] );
        links[ i ].rel = null;
      }
    }
  }
  // if link[rel=preload] is not supported, we must fetch the CSS manually using loadCSS
  if( !support() ){
    poly();
    var run = w.setInterval( poly, 300 );
    if( w.addEventListener ){
      w.addEventListener( "load", function(){
        w.clearInterval( run );
      } )
    }
  }
}( this ));
