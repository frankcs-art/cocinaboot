import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import spdy from 'spdy';
import fs from 'fs';
import http from 'http';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HTTP_PORT = 8080; // Port for HTTP redirection

// Rate Limiting: Protect from DoS by limiting requests per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

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
            "upgrade-insecure-requests": [],
        },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
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

// Generic Error Handler: Prevent sensitive data leaks
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    res.status(500).send('Internal Server Error');
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
        // In production, consider a strict whitelist of your domains.
        const isValidHost = host && /^[a-zA-Z0-9.-]+$/.test(host);
        const safeHost = isValidHost ? host : 'localhost';

        // SECURITY: Strict URL validation to prevent open redirects via protocol-relative URLs (e.g., //evil.com).
        const safeUrl = (req.url && req.url.startsWith('/') && !req.url.startsWith('//')) ? req.url : '/';

        console.log(`[SECURITY] Redirecting to https://${safeHost}:${PORT}${safeUrl} (Original Host: ${req.headers.host})`);
        res.writeHead(307, { "Location": `https://${safeHost}:${PORT}${safeUrl}` });
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
        // SECURITY: Validate Host header.
        const isValidHost = host && /^[a-zA-Z0-9.-]+$/.test(host);
        const safeHost = isValidHost ? host : 'localhost';

        // SECURITY: Open redirect prevention.
        const safeUrl = (req.url && req.url.startsWith('/') && !req.url.startsWith('//')) ? req.url : '/';

        console.log(`[SECURITY] Redirecting to http://${safeHost}:${PORT}${safeUrl} (Original Host: ${req.headers.host})`);
        res.writeHead(307, { "Location": `http://${safeHost}:${PORT}${safeUrl}` });
        res.end();
    }).listen(HTTP_PORT, () => {
        console.log(`➡️  HTTP Redirect running at http://localhost:${HTTP_PORT} (Redirecting to HTTP)`);
    });
}
