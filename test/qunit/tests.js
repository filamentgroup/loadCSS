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

	test( 'function loadCSS exists', function(){
		expect(2);
		ok( window.loadCSS, "loadCSS should exist on the window object" );
		ok( typeof window.loadCSS === "function", "loadCSS should be a function" );
	});

	test( 'loadCSS adds a stylesheet to CSSOM', function(){
		expect(1);
		var omLength = window.document.styleSheets.length;
		loadCSS("files/test.css");
		equal(window.document.styleSheets.length, omLength + 1, "stylesheets incremented by 1" );
	});



}(window));
