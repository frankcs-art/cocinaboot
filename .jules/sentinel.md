## 2026-02-02 - [CRITICAL] Private Keys Committed to Repository
**Vulnerability:** Private SSL key (`server.key`) and certificate (`server.crt`) were committed to the git repository and used by the Express server.
**Learning:** Hardcoding paths to SSL certificates in server startup logic (`fs.readFileSync`) without checks often forces developers to commit these files or deal with startup crashes.
**Prevention:** Implement conditional HTTPS startup that checks for file existence before attempting to read them, and always ensure `.key` and `.crt` files are in `.gitignore`. Use environment variables or secrets management for production certificates.

## 2026-02-08 - [HIGH] Host Header Injection in Redirection Server
**Vulnerability:** The HTTP to HTTPS redirection logic used `req.headers.host` directly to construct the `Location` header, allowing attackers to redirect users to arbitrary domains or inject malicious characters.
**Learning:** Even simple redirection servers must validate the `Host` header against a whitelist of characters (alphanumeric, dots, dashes) to prevent CRLF injection and basic XSS. While a domain whitelist is preferred, character validation is a critical first line of defense.
**Prevention:** Always sanitize or validate the `Host` header before using it in response headers. Implement regex-based character validation at a minimum.
