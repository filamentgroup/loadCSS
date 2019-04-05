const path = require( "path" );

const chokidar = require( "chokidar" );
const sievery = require( "sievery" );
const uglify = require( "uglify-es" ).minify;

const { readFileSync, outputFileSync, removeSync } = require( "fs-extra" );


const watch = process.argv.includes( "-w" );


const modern = "MODERN";
const legacy = "LEGACY";
const gns = "GLOBAL"; // global namespace, i.e. `window`
const cjs = "CJS"; // commonJS, as used by `node.js`
const esm = "ESM"; // ESmodule, the modern standard


let allGood = true;

removeSync( "dist" );

buildPolyfill();
buildLoadCSS();
buildOnloadCSS();

if ( allGood ) {
	console.info( "\nAll good! :)\n" );
} else {
	console.info( "\nBetter check the warnings above :\\\n" );
};

if ( watch ) {
	console.info( "\nWatching :)\n" );

	chokidar.watch( "src/polyfill.js" ).on( "change", buildPolyfill );
	chokidar.watch( "src/loadCSS.js" ).on( "change", buildLoadCSS );
	chokidar.watch( "src/onloadCSS.js" ).on( "change", buildOnloadCSS );
}


//


function buildPolyfill() {
	const originalCode = source( "polyfill.js" );
	const [ modernCode, legacyCode ] = sievery( originalCode, [ modern, legacy ] );
	write( "polyfill.js", modernCode );
	write( "polyfill.legacy.js", legacyCode );
};

function buildLoadCSS() {
	const originalCode = source( "loadCSS.js" );
	const [ cjsCode, esmCode, globalCode ] = sievery( originalCode, [ cjs, esm, gns ] );
	write( "loadCSS.js", cjsCode );
	write( "loadCSS.mjs", esmCode );
	write( "loadCSS.global.js", globalCode );
};

function buildOnloadCSS() {
	const originalCode = source( "onloadCSS.js" );
	const [ modernCode, legacyCode ] = sievery( originalCode, [ modern, legacy ] );
	write( "onloadCSS.js", modernCode );
	write( "onloadCSS.legacy.js", legacyCode );
};


//


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
