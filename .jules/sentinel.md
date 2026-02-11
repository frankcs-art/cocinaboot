## 2026-02-02 - [CRITICAL] Private Keys Committed to Repository
**Vulnerability:** Private SSL key (`server.key`) and certificate (`server.crt`) were committed to the git repository and used by the Express server.
**Learning:** Hardcoding paths to SSL certificates in server startup logic (`fs.readFileSync`) without checks often forces developers to commit these files or deal with startup crashes.
**Prevention:** Implement conditional HTTPS startup that checks for file existence before attempting to read them, and always ensure `.key` and `.crt` files are in `.gitignore`. Use environment variables or secrets management for production certificates.

## 2026-02-09 - [ENHANCEMENT] Host Header and CSP Hardening
**Vulnerability:** Potential Host Header Injection in redirection server and unsafe CSP allowing inline scripts.
**Learning:** Raw Node.js HTTP servers used for redirection are vulnerable to Host Header Injection if req.headers.host is used directly in Location headers. Validating against a character whitelist and ensuring req.url starts with '/' mitigates injection and open redirect risks.
**Prevention:** Always validate Host headers before use in redirects and keep CSP as restrictive as possible (removing 'unsafe-inline' from script-src when not strictly required).

## 2026-02-10 - [CHALLENGE] Portability vs. Strict Host Whitelisting
**Vulnerability:** Host Header Injection in redirects.
**Learning:** While a hardcoded Host whitelist is the most secure approach, it creates a "breaking change" for portability in environments where the domain is not known at compile time (e.g., Vercel previews). A balance must be struck by using safe regex validation for the Host header combined with strict path sanitization to prevent open redirects.
**Prevention:** Use `process.env.ALLOWED_HOSTS` for strict production environments, but fallback to safe character-restricted regex validation for flexibility, and always sanitize the redirect path to prevent protocol-relative URL exploits (`//evil.com`).
