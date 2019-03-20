const fs = require( "fs" );
const http = require( "http" );
const path = require( "path" );

const cssDelay = 100;
const cssDelayLong = 1200;

const contentTypes = {
	".css": "text/css",
	".html": "text/html",
	".js": "application/javascript"
};

module.exports = function runServer( {
	port = 3000,
	onLaunch = ()=>{},
	onRequest = ()=>{},
	verbose = false
} ) {
	const server = http.createServer( requestHandler );

	server.on( "close", () => {
		console.log( "\nServer closed." );
		process.exit();
	} );

	server.listen( port, launchCallback );

	return server;

	function launchCallback( err ) {
		if ( err ) {
			return console.error( "Could not run server:\n", err );
		}

		console.log( `Server is listening on port ${port}.` );
		console.log( "Stop using SIGINT (Ctrl+C)\n" );

		onLaunch();

		// https://stackoverflow.com/a/14861513
		if ( process.platform === "win32" ) {
			require( "readline" )
				.createInterface( {
					input: process.stdin,
					output: process.stdout
				} )
				.on( "SIGINT", () => {
					process.emit( "SIGINT" );
				} )
			;
		}

		process.on( "SIGINT", () => {
			server.close();
			console.log( "\nReceived SIGINT, Closing server." );
		} );

		process.on( "SIGTERM", () => {
			server.close();
			console.log( "\nReceived SIGTERM, Closing server." );
		} );
	}

	function requestHandler( request, response ) {
		if ( verbose ) {
			console.log( JSON.stringify( request.url ) );
		}

		try {
			onRequest();

			response.setHeader( "charset", "UTF-8" );
			response.setHeader( "Cache-Control", "no-store" );

			let slug = request.url.replace( /\?.*/, "" );
			if ( !path.extname( slug ) ) {
				slug += "/index.html";
			}

			response.setHeader(
				"Content-type",
				contentTypes[ path.extname( slug ) ]
			);

			let filePath = path.join( "test", slug );

			if ( !fs.existsSync( filePath ) ) {
				filePath = path.join( "dist", slug );
			}

			if ( !fs.existsSync( filePath ) ) {
				throw new Error( `Could not find a file matching "${request.url}"` );
			}

			const content = fs.readFileSync(
				filePath
			).toString().replace(
				/<!--#include virtual="([^"]+)" -->/g,
				( _, includePath ) => fs.readFileSync(
					path.resolve( path.dirname( path.join( ".", filePath ) ), includePath )
				)
			);

			// CSS files get special handling to prevent race conditions
			// or make pre-/post-load states visible
			if ( slug.endsWith( ".css" ) ) {

				// slow means a relatively long delay
				if ( slug.endsWith( "slow.css" ) ) {
					setTimeout( () => {
						response.end( content );
					}, cssDelayLong );

					return;
				}

				// defaults should be loaded first
				if ( slug.endsWith( "default.css" ) ) {
					response.end( content );
					setTimeout( () => {
						response.end( content );
					}, cssDelay );

					return;
				}

				response.end( content );
				setTimeout( () => {
					response.end( content );
				}, cssDelay );
			} else {
				response.end( content );
			}
		} catch ( error ) {
			const errorMessage = (
				error.message && ( error.message + "\n" + error.stack )
			) || error;

			if ( errorMessage.includes( "ENOENT" ) ) {
				response.statusCode = 404;
			} else {
				response.statusCode = 500;
			}

			response.end( "<pre>" + errorMessage );
		}
	}
};
