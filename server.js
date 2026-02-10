import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import spdy from 'spdy';
import fs from 'fs';
import http from 'http';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HTTP_PORT = 8080; // Port for HTTP redirection

// Security Headers with Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://cdn.tailwindcss.com", "https://apis.google.com"],
            "img-src": ["'self'", "data:", "https:*"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "connect-src": ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "https://*.google-analytics.com", "https://*.firebaseapp.com"],
            "frame-src": ["'self'", "https://*.firebaseapp.com"],
        },
    },
}));

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

// SSL Paths
const keyPath = path.join(__dirname, 'server.key');
const certPath = path.join(__dirname, 'server.crt');
const hasCertificates = fs.existsSync(keyPath) && fs.existsSync(certPath);

if (hasCertificates) {
    // SSL Options
    const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
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
        const host = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
        // SECURITY: Validate Host header to prevent Host Header Injection.
        // We whitelist alphanumeric, dots and dashes. For production, consider a domain whitelist.
        const isValidHost = /^[a-zA-Z0-9.-]+$/.test(host);
        const safeHost = isValidHost ? host : 'localhost';
        // SECURITY: Ensure req.url starts with / to prevent open redirects via malformed URLs.
        const safeUrl = (req.url && req.url.startsWith('/')) ? req.url : '/';
        res.writeHead(301, { "Location": `https://${safeHost}:${PORT}${safeUrl}` });
        res.end();
    }).listen(HTTP_PORT, () => {
        console.log(`➡️  HTTP Redirect running at http://localhost:${HTTP_PORT}`);
    });
} else {
    // Fallback to HTTP if certificates are missing
    app.listen(PORT, () => {
        console.log(`✅ HTTP Server running at http://localhost:${PORT} (SSL certificates not found)`);
    });

    // Optional: Still run redirection server if needed, but point to HTTP
    http.createServer((req, res) => {
        const host = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
        // SECURITY: Validate Host header to prevent Host Header Injection
        const isValidHost = /^[a-zA-Z0-9.-]+$/.test(host);
        const safeHost = isValidHost ? host : 'localhost';
        // SECURITY: Ensure req.url starts with / to prevent open redirects
        const safeUrl = (req.url && req.url.startsWith('/')) ? req.url : '/';
        res.writeHead(301, { "Location": `http://${safeHost}:${PORT}${safeUrl}` });
        res.end();
    }).listen(HTTP_PORT, () => {
        console.log(`➡️  HTTP Redirect running at http://localhost:${HTTP_PORT} (Redirecting to HTTP)`);
    });
}
