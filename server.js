/* jshint esversion: 6 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const port = 3000;

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
	if (err) {
		return console.error('could not run server', err);
	}

	console.log(`server is listening on ${port}`);
});


const contentTypes = {
	'.css': 'text/css',
	'.html': 'text/html',
	'.js': 'application/javascript',
};

function requestHandler (request, response) {
	console.log(JSON.stringify(request.url));
	try {
		response.setHeader('charset', 'UTF-8');
		response.setHeader('Cache-Control', 'max-age=500');

		if (!path.extname(request.url)) {
			request.url += '/index.html';
		}

		response.setHeader('Content-type', contentTypes[path.extname(request.url)]);

		const content = fs.readFileSync(
			path.join('.', request.url)
		).toString().replace(/<!--#include virtual="([^"]+)" -->/g, (match, filepath) => fs.readFileSync(
			path.resolve(path.dirname(path.join('.', request.url)), filepath)
		));

		if (request.url.endsWith('slow.css')) {
			setTimeout(() => {
				response.end( content );
			}, 5000);
		} else {
			response.end( content );
		}
	} catch (error) {
		const errorMessage = (error.message && (error.message + '\n' + error.stack)) || error;

		if (errorMessage.includes('ENOENT')) {
			response.statusCode = 404;
		} else {
			response.statusCode = 500;
		}

		response.end('<pre>' + errorMessage);
	}
}
