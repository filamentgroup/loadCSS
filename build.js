const path = require( "path" );

const chokidar = require( "chokidar" );
const uglify = require( "uglify-es" ).minify;

const { readFileSync, outputFileSync, removeSync } = require( "fs-extra" );


const watch = process.argv.includes( "-w" );


const modern = "MODERN";
const legacy = "LEGACY";
const gns = "GLOBAL"; // global namespace, i.e. `window`
const cjs = "CJS"; // commonJS, as used by `node.js`
const esm = "ESM"; // ESmodule, the modern standard


const multipleBlankLines = /\n{3,}/g;
const singleBlankLine = "\n\n";

let allGood = true;

removeSync( "dist" );

if ( watch ) {
	console.info( "\nWatching :)\n" );

	chokidar.watch( "src/polyfill.js" ).on( "all", buildPolyfill );
	chokidar.watch( "src/loadCSS.js" ).on( "all", buildLoadCSS );
	chokidar.watch( "src/onloadCSS.js" ).on( "all", buildOnloadCSS );
} else {
	buildPolyfill();
	buildLoadCSS();
	buildOnloadCSS();

	if ( allGood ) {
		console.info( "\nAll good! :)\n" );
	} else {
		console.info( "\nBetter check the warnings above :\\\n" );
	};
}


//


function buildPolyfill() {
	const originalCode = source( "polyfill.js" );
	const [ modernCode, legacyCode ] = sift( originalCode, [ modern, legacy ] );
	write( "polyfill.js", modernCode );
	write( "polyfill.legacy.js", legacyCode );
};

function buildLoadCSS() {
	const originalCode = source( "loadCSS.js" );
	const [ cjsCode, esmCode, globalCode ] = sift( originalCode, [ cjs, esm, gns ] );
	write( "loadCSS.js", cjsCode );
	write( "loadCSS.mjs", esmCode );
	write( "loadCSS.global.js", globalCode );
};

function buildOnloadCSS() {
	const originalCode = source( "onloadCSS.js" );
	const [ modernCode, legacyCode ] = sift( originalCode, [ modern, legacy ] );
	write( "onloadCSS.js", modernCode );
	write( "onloadCSS.legacy.js", legacyCode );
};


//


function lineMarker( token ) {
	return new RegExp( ` // ${token}$` );
}
function startMarker( token ) {
	return new RegExp( `// ${token}/$` );
}
function endMarker( token ) {
	return new RegExp( `// /${token}$` );
}


function source( filename ) {
	return readFileSync( `src/${filename}` ).toString();
}
function write( filename, code ) {
	outputFileSync( `dist/${filename}`, code );

	const extension = path.extname( filename );
	const basename = path.basename( filename, extension );
	outputFileSync(
		`dist/${basename}.min${extension}`,
		minify( { [ filename ]: code } )
	);
}

function minify( code ) {
	const result = uglify( code, {
		output: {
			comments: /^\!/
		},
		warnings: true
	} );

	if ( result.warnings ) {
		allGood = false;
		console.warn( result.warnings );
	}

	if ( result.error ) {
		throw result.error;
	}

	return result.code;
}


function sift( originalCode, targets ) {
	const lines = originalCode.split( "\n" );
	const codes = new Array( targets.length );

	const normalMode = -1;
	const targetMode = targets.length;
	let excludeMode = 0;

	let mode = normalMode;

	const targetMarkers = targets.map( target => ( {
		line: lineMarker( target ),
		start: startMarker( target ),
		end: endMarker( target )
	} ) );


	targetMarkers.forEach( ( target, index ) => {
		const excludes = targetMarkers.filter( item => item !== target );
		const code = [];

		lines.forEach( line => {
			if ( mode === excludeMode ) {
				if ( excludes[ excludeMode ].end.test( line ) ) {
					mode = normalMode;
				}
				return;
			}
			if ( mode === targetMode ) {
				if ( target.end.test( line ) ) {
					mode = normalMode;
					return;
				}

				code.push( line );
				return;
			}

			if ( target.line.test( line ) ) {
				code.push( line.replace( target.line, "" ) );
				return;
			}

			if ( target.start.test( line ) ) {
				mode = targetMode;
				return;
			}

			for ( let i = 0; i < excludes.length; i++ ) {
				if ( excludes[ i ].line.test( line ) ) {
					return;
				}

				if ( excludes[ i ].start.test( line ) ) {
					mode = excludeMode = i;
					return;
				}
			}

			code.push( line );
		} );

		codes[ index ] = code.join( "\n" ).replace( multipleBlankLines, singleBlankLine );
	} );

	return codes;
}
