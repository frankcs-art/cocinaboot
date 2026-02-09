## 2026-02-02 - [CRITICAL] Private Keys Committed to Repository
**Vulnerability:** Private SSL key (`server.key`) and certificate (`server.crt`) were committed to the git repository and used by the Express server.
**Learning:** Hardcoding paths to SSL certificates in server startup logic (`fs.readFileSync`) without checks often forces developers to commit these files or deal with startup crashes.
**Prevention:** Implement conditional HTTPS startup that checks for file existence before attempting to read them, and always ensure `.key` and `.crt` files are in `.gitignore`. Use environment variables or secrets management for production certificates.

## 2026-02-09 - [ENHANCEMENT] Host Header and CSP Hardening
**Vulnerability:** Potential Host Header Injection in redirection server and unsafe CSP allowing inline scripts.
**Learning:** Raw Node.js HTTP servers used for redirection are vulnerable to Host Header Injection if req.headers.host is used directly in Location headers. Validating against a character whitelist and ensuring req.url starts with '/' mitigates injection and open redirect risks.
**Prevention:** Always validate Host headers before use in redirects and keep CSP as restrictive as possible (removing 'unsafe-inline' from script-src when not strictly required).
