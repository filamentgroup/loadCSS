const runServer = require( "./server" );
const port = 3003;

let server;
let timeout;

module.exports = function( grunt ) {
	server = runServer( {
		port,
		onLaunch: serverCloseSoon,
		onRequest: serverCloseSoon
	} );

	grunt.loadNpmTasks( "grunt-contrib-qunit" );

	grunt.initConfig( {
		qunit: { all: { options: {
			urls: [ "http://localhost:" + port + "/qunit/index.html" ]
		} } }
	} );

	grunt.registerTask( "default", [ "qunit" ] );
};

function serverCloseSoon() {
	clearTimeout( timeout );
	timeout = setTimeout( ()=>server.close(), 500 );
}
