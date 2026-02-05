## 2026-02-02 - [CRITICAL] Private Keys Committed to Repository
**Vulnerability:** Private SSL key (`server.key`) and certificate (`server.crt`) were committed to the git repository and used by the Express server.
**Learning:** Hardcoding paths to SSL certificates in server startup logic (`fs.readFileSync`) without checks often forces developers to commit these files or deal with startup crashes.
**Prevention:** Implement conditional HTTPS startup that checks for file existence before attempting to read them, and always ensure `.key` and `.crt` files are in `.gitignore`. Use environment variables or secrets management for production certificates.

## 2026-02-05 - [HIGH] XSS via AI-generated suggestions
**Vulnerability:** The `Orders` component used `dangerouslySetInnerHTML` to render AI-generated suggestions from the Gemini API. An attacker could potentially perform a prompt injection attack to include malicious HTML/scripts in the AI's response, leading to Cross-Site Scripting (XSS).
**Learning:** Rendering content from external APIs (even AI) using `dangerouslySetInnerHTML` is dangerous as it trusts the input source completely.
**Prevention:** Avoid `dangerouslySetInnerHTML` for untrusted content. Use standard React text rendering and CSS properties like `whitespace-pre-wrap` to preserve formatting safely.
