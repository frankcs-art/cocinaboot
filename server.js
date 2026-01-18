import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import spdy from 'spdy';
import fs from 'fs';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HTTP_PORT = 8080; // Port for HTTP redirection

// Enable Gzip/Brotli compression
app.use(compression());

// Serve static files from 'dist'
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: false
}));

// SPA Fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// SSL Options
const options = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
};

// Start HTTPS (HTTP/2) Server
spdy.createServer(options, app).listen(PORT, (error) => {
    if (error) {
        console.error(error);
        return process.exit(1);
    }
    console.log(`✅ HTTPS/2 Server running at https://localhost:${PORT}`);
});

// Start HTTP Server (Redirect to HTTPS)
http.createServer((req, res) => {
    res.writeHead(301, { "Location": `https://localhost:${PORT}${req.url}` });
    res.end();
}).listen(HTTP_PORT, () => {
    console.log(`➡️  HTTP Redirect running at http://localhost:${HTTP_PORT}`);
});
