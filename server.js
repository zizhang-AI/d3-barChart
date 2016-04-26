'use strict';
const http = require('http');
const url  = require('url');
const fs   = require('fs');
let mimes  = {
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js':  'text/javascript',
	'.gif': 'image/gif',
	'.jpg': 'image/jpeg',
	'.png': 'image/png'
};
const path = require('path');
// if you do not specifically reject the promise, and an error happens, the 
// Promise will reject by itself. But it's good practice to write the invoc.
function fileAccess(filepath) {
	return new Promise((resolve, reject) => {
		fs.access(filepath, fs.F_OK, error => {
			if(!error)	resolve(filepath);
			else		reject(error);
		})
	}); 
 }

function streamFile(filepath) {
	return new Promise((resolve, reject) => {
		let fileStream = fs.createReadStream(filepath); // an event emitter
		fileStream.on('open', () => {
			resolve(fileStream);
		});
		fileStream.on('error', error => {
			reject(error);
		});

	});
}
function webserver(req, res) {

	let baseURI = url.parse(req.url);
	let filepath = __dirname + (baseURI.pathname === '/'? '/index.htm':baseURI.pathname);
	let contentType = mimes[path.extname(filepath)]; 

	fileAccess(filepath)
		.then(streamFile) // if the previous Promise is resolved, then invoc the
						  // function in the then method.
		.then(fileStream => {
			res.writeHead(200, {'content-type': contentType});
			// res.end(content,'utf-8');
			// a stream is a continuous flow of data.
			// vs an entire file 
			fileStream.pipe(res); //pipe out to response!
			// now we can stream the data in and out.
		})
		.catch(error => { //all in one place!
			res.writeHead(404);
			res.end(JSON.stringify(error));
		})

// the fs.readfile() method is not efficient because it buffers up every file
// into the memory before the response. This makes your webserver a memory
// hog, chocking your server's memory especially when it has to serve 
// many concurrent requests. 
// Another problem is flow control. There is no mechanism governing the speed
// at which the data is read in from the disk vs. the speed of data flowing 
// out through the response. If the outflow slows down, you cannot tell fs.ReadF()
// to stop reading data from disk.
// Streams: outflow slows down, inflow slows as well. data read in chunk by chunk
// traveling continuously, piping out chunk by chunk. http server instance as an
// event emitter is already using streams. 
}

http.createServer(webserver).listen(5000, ()=>console.log('Webserver running on port 5000'));