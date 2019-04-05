const path = require( "path" );

const chokidar = require( "chokidar" );
const sievery = require( "sievery" );
const uglify = require( "uglify-es" ).minify;

const { readFileSync, outputFileSync, removeSync } = require( "fs-extra" );


const watchMode = process.argv.includes( "-w" );


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

if ( watchMode ) {
	console.info( "\nWatching :)\n" );

	watch( "src/polyfill.js", buildPolyfill );
	watch( "src/loadCSS.js", buildLoadCSS );
	watch( "src/onloadCSS.js", buildOnloadCSS );
}


//


function buildPolyfill() {
	console.info( "Building polyfill\n" );

	const originalCode = source( "polyfill.js" );
	const [ modernCode, legacyCode ] = sievery( originalCode, [ modern, legacy ] );
	write( "polyfill.js", modernCode );
	write( "polyfill.legacy.js", legacyCode );
};

function buildLoadCSS() {
	console.info( "Building loadCSS\n" );

	const originalCode = source( "loadCSS.js" );
	const [ cjsCode, esmCode, globalCode ] = sievery( originalCode, [ cjs, esm, gns ] );
	write( "loadCSS.js", cjsCode );
	write( "loadCSS.mjs", esmCode );
	write( "loadCSS.global.js", globalCode );
};

function buildOnloadCSS() {
	console.info( "Building onloadCSS" );

	const originalCode = source( "onloadCSS.js" );
	const [ cjsCode, esmCode, globalCode ] = sievery( originalCode, [ cjs, esm, gns ] );

	console.info( "    CJS" );
	const [ modernCJS, legacyCJS ] = sievery( cjsCode, [ modern, legacy ] );
	write( "onloadCSS.js", modernCJS );
	write( "onloadCSS.legacy.js", legacyCJS );

	console.info( "    ESM" );
	const [ modernESM, legacyESM ] = sievery( esmCode, [ modern, legacy ] );
	write( "onloadCSS.mjs", modernESM );
	write( "onloadCSS.legacy.mjs", legacyESM );

	console.info( "    Global" );
	const [ modernGlobal, legacyGlobal ] = sievery( globalCode, [ modern, legacy ] );
	write( "onloadCSS.global.js", modernGlobal );
	write( "onloadCSS.global.legacy.js", legacyGlobal );

	console.info();
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

function watch( filePath, changeHandler ) {
	chokidar.watch( filePath, {
		awaitWriteFinish: {
			stabilityThreshold: 200,
			pollInterval: 10
		}
	} ).on( "change", changeHandler );
}
