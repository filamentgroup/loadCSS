const open = require( "opn" );

const runServer = require( "./server" );

const port = 3000;
runServer( {
	port,
	onLaunch() {
		console.log( "Launching default browser\n" );
		open( "http://localhost:" + port );
	},
	verbose: process.argv.includes( "--verbose" )
} );
