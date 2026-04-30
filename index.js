'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
const ROOT = __dirname;

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
};

function safeResolve(urlPath) {
	const clean = urlPath.split('?')[0].split('#')[0];
	const rel = clean === '/' ? 'index.html' : clean.replace(/^\/+/, '');
	const abs = path.normalize(path.join(ROOT, rel));

	if (!abs.startsWith(ROOT)) {
		return null;
	}

	return abs;
}

const server = http.createServer((req, res) => {
	const filePath = safeResolve(req.url || '/');
	if (!filePath) {
		res.writeHead(400);
		res.end('Bad request');
		return;
	}

	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end('Not found');
			return;
		}

		const ext = path.extname(filePath).toLowerCase();
		const contentType = MIME[ext] || 'application/octet-stream';

		res.writeHead(200, {
			'Content-Type': contentType,
			'Cache-Control': 'no-store',
		});
		res.end(data);
	});
});

server.listen(PORT, () => {
	console.log(`Space Explorer: http://localhost:${PORT}`);
});

