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
		onloadCSS( ss, function(){
			ok("stylesheet loaded successfully");
			start();
		});
	});

	asyncTest( 'loadCSS loads a CSS file with a relative path', function(){
		expect(1);
		var ss = loadCSS("../../test/qunit/files/test.css");
		onloadCSS( ss, function(){
			ok("stylesheet loaded successfully");
			start();
		});
	});

	asyncTest( 'loadCSS loads a CSS file with specific attributes', function(){
		expect(3);
		var attributes = {
			title: "Default Style",
			type: "text/css"
		};
		var ss = loadCSS("files/test.css", null, null, attributes);
		onloadCSS( ss, function(){
			ok("stylesheet loaded successfully");
			equal(ss.title, attributes.title, "'title' attribute should be '" + attributes.title + "'");
			equal(ss.type, attributes.type, "'type' attribute should be '" + attributes.type + "'");
			start();
		});
	});

	asyncTest( 'loadCSS sets media type before and after the stylesheet is loaded', function(){
		expect(2);
		var ss = loadCSS("files/test.css");
		ok(ss.media, initialMedia, "media type begins as" + initialMedia );
		onloadCSS( ss, function(){
			equal(ss.media, "all", "media type is all");
			start();
		});
	});

	asyncTest( 'loadCSS sets media type to a custom value if specified, after load', function(){
		expect(2);
		var med = "print";
		var ss = loadCSS("files/test.css", null, med);
		ok(ss.media, initialMedia, "media type begins as " + initialMedia );
		onloadCSS( ss, function(){
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

	asyncTest( 'onloadCSS callback fires after css is loaded', function(){
		expect(1);
		var getStyles = window.getComputedStyle ? function (node) { return window.getComputedStyle(node, null); } : function (node) { return node.currentStyle; };
		var elem = window.document.createElement("div");
		elem.className = "bar";
		document.body.appendChild( elem );
		var ss = loadCSS("files/test.css?1");
		onloadCSS( ss, function(){
			equal(getStyles(elem).backgroundColor, 'rgb(0, 128, 0)', 'background is green' );
			start();
		} );
	});


}(window));
