/*global window:true*/
(function(window) {
	/*
		======== A Handy Little QUnit Reference ========
		http://api.qunitjs.com/

		Test methods:
			module(name, {[setup][ ,teardown]})
			test(name, callback)
			expect(numberOfAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			throws(block, [expected], [message])
	*/

	// initial value of media attr
	var initialMedia = "only x";

	test( 'function loadCSS exists', function(){
		expect(2);
		ok( window.loadCSS, "loadCSS should exist on the window object" );
		ok( typeof window.loadCSS === "function", "loadCSS should be a function" );
	});

	asyncTest( 'loadCSS loads a CSS file', function(){
		expect(1);
		var ss = loadCSS("files/test.css");
		ss.onloadcssdefined(function(){
			ok("stylesheet loaded successfully");
			start();
		});
	});

	asyncTest( 'loadCSS loads a CSS file with a relative path', function(){
		expect(1);
		var ss = loadCSS("../../test/qunit/files/test.css");
		ss.onloadcssdefined(function(){
			ok("stylesheet loaded successfully");
			start();
		});
	});

	asyncTest( 'loadCSS sets media type before and after the stylesheet is loaded', function(){
		expect(2);
		var ss = loadCSS("files/test.css");
		ok(ss.media, initialMedia, "media type begins as" + initialMedia );
		ss.onloadcssdefined(function(){
			equal(ss.media, "all", "media type is all");
			start();
		});
	});

	asyncTest( 'loadCSS sets media type to a custom value if specified, after load', function(){
		expect(2);
		var med = "print";
		var ss = loadCSS("files/test.css", null, med);
		ok(ss.media, initialMedia, "media type begins as " + initialMedia );
		ss.onloadcssdefined(function(){
			equal(ss.media, med, "media type is " + med);
			start();
		});
	});

	test( 'loadCSS injects before a particular specified element', function(){
		expect(1);
		var elem = window.document.getElementById("before-test");
		var ss = loadCSS("files/test.css", elem);
		equal(ss.nextElementSibling, elem );
	});


}(window));
