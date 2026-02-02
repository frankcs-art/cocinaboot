## 2026-02-02 - [CRITICAL] Private Keys Committed to Repository
**Vulnerability:** Private SSL key (`server.key`) and certificate (`server.crt`) were committed to the git repository and used by the Express server.
**Learning:** Hardcoding paths to SSL certificates in server startup logic (`fs.readFileSync`) without checks often forces developers to commit these files or deal with startup crashes.
**Prevention:** Implement conditional HTTPS startup that checks for file existence before attempting to read them, and always ensure `.key` and `.crt` files are in `.gitignore`. Use environment variables or secrets management for production certificates.
