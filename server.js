const fs = require( "fs" );
const http = require( "http" );
const open = require( "opn" );
const path = require( "path" );


const server = http.createServer( requestHandler );
const port = 3000;
const cssDelay = 1200;


server.on( "close", () => {
	console.log( "\nServer closed." );
	process.exit();
} );

server.listen( port, ( err ) => {
	if ( err ) {
		return console.error( "Could not run server:\n", err );
	}

	console.log( `Server is listening on port ${port}.` );
	console.log( "Stop using SIGINT (Ctrl+C)\n" );

	console.log( "Launching default browser\n" );
	open( "http://localhost:3000" );

	// https://stackoverflow.com/a/14861513
	if ( process.platform === "win32" ) {
		require( "readline" )
		.createInterface( {
			input: process.stdin,
			output: process.stdout
		} )
		.on( "SIGINT", () => {
			process.emit( "SIGINT" );
		} );
	}

	process.on( "SIGINT", () => {
		server.close();
		console.log( "\nReceived SIGINT, Closing server." );
	} );

	process.on( "SIGTERM", () => {
		server.close();
		console.log( "\nReceived SIGTERM, Closing server." );
	} );
} );


const contentTypes = {
	".css": "text/css",
	".html": "text/html",
	".js": "application/javascript"
};

function requestHandler( request, response ) {
	console.log( JSON.stringify( request.url ) );

	try {
		response.setHeader( "charset", "UTF-8" );
		response.setHeader( "Cache-Control", "no-store" );

		let slug = request.url;
		if ( !path.extname( slug ) ) {
			slug += "/index.html";
		}

		response.setHeader( "Content-type", contentTypes[ path.extname( slug ) ] );

		let filePath = path.join( "test", slug );

		if ( !fs.existsSync( filePath ) ) {
			filePath = path.join( "src", slug );
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

		if ( slug.endsWith( "slow.css" ) ) {
			setTimeout( () => {
				response.end( content );
			}, cssDelay );
		} else {
			response.end( content );
		}
	} catch ( error ) {
		const errorMessage = ( error.message && ( error.message + "\n" + error.stack ) ) || error;

		if ( errorMessage.includes( "ENOENT" ) ) {
			response.statusCode = 404;
		} else {
			response.statusCode = 500;
		}

		response.end( "<pre>" + errorMessage );
	}
}
