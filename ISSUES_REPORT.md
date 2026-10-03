# LMS Project - Verified Issues Report

Status: Yes — this project has real issues that should be fixed before production use.

## Critical Issues

### 1. Sensitive credentials are committed to the repository
- Location: `server/.env`
- Verified finding: The file contains production-like values for MongoDB, JWT secrets, Google Books API key, and SMTP credentials.
- Why it matters: Anyone with repo access can abuse the database, generate tokens, and send emails through the app.
- Fix:
  - Remove `.env` from Git tracking and rotate every secret immediately.
  - Create a `server/.env.example` with placeholders only.
  - Keep secrets in deployment environment variables, not in source control.

### 2. Password reset flow depends on an undefined environment variable
- Location: `server/src/controllers/user.controller.js`
- Verified finding: `const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`` is used, but `CLIENT_URL` is not defined in the project `.env` file.
- Why it matters: Forgot-password emails will generate invalid/reset links in local or deployed environments unless this is configured manually.
- Fix:
  - Add `CLIENT_URL=http://localhost:5173` (or deployed frontend URL) to the environment file.
  - Validate that the value is present before sending the email.

### 3. Cookies are configured for HTTPS only, which breaks local development
- Location: `server/src/controllers/user.controller.js`
- Verified finding: Auth cookies are created with `secure: true`.
- Why it matters: Browsers will not store secure cookies over plain HTTP, so login will fail in local development when running on `http://localhost`.
- Fix:
  - Use `secure: process.env.NODE_ENV === 'production'`.
  - Keep `sameSite` reasonable for the app's deployment mode.

### 4. Password reset emails can silently fail without surfacing the error to the user
- Location: `server/src/controllers/user.controller.js`
- Verified finding: The code catches SMTP failure and logs it but still responds with a successful message.
- Why it matters: Users may think an email was sent even when it was not, which can create confusion and support issues.
- Fix:
  - Return a non-success status when email delivery fails in a real environment.
  - Log the failure and optionally allow a retry path.

## High Priority Issues

### 5. API security is not fully hardened for production
- Locations: `server/src/app.js`, `server/src/middleware/auth.middleware.js`
- Verified finding: The app sets CORS to a single origin and does not add a production-grade security layer beyond basic middleware.
- Why it matters: This is acceptable for a local prototype, but not robust for public deployment.
- Fix:
  - Allow a whitelist of origins from env.
  - Add helmet and request/IP rate limiting.
  - Keep `trust proxy` enabled in production when behind a reverse proxy.

### 6. Some log output is not appropriate for production deployment
- Locations: `server/src/app.js`, `server/src/db/index.js`, `server/src/server.js`
- Verified finding: The server logs request details and connection info directly to stdout.
- Why it matters: This is fine for debugging, but not ideal for production monitoring and audit trails.
- Fix:
  - Use a structured logger with levels.
  - Avoid exposing raw connection or debugging details in production.

## Medium Priority Issues

### 7. The project is missing a safe environment template
- Locations: root project, `server/`
- Verified finding: There is no `.env.example` file describing required variables.
- Why it matters: New developers cannot confidently set up the project without inspecting code or secret files.
- Fix:
  - Add an example file documenting all required keys.

### 8. Some runtime assumptions are not validated early enough
- Locations: multiple backend files
- Verified finding: Several features assume values such as `CLIENT_URL`, JWT secrets, SMTP config, and database configuration are always present.
- Why it matters: The app can fail during runtime instead of failing fast with a clear startup check.
- Fix:
  - Validate env variables at startup and throw explicit errors if missing.

## Summary

The project is not completely broken, but it does have a few important production risks and configuration bugs:

1. Secret leakage in committed `.env` files
2. Broken or undefined reset-password URL configuration
3. Cookie configuration incompatible with local HTTP
4. Silent SMTP failures in password reset flow
5. Missing production hardening and env validation

These are the issues I would fix first. The earlier larger report was too broad and included many speculative findings; the list above reflects what is actually present in the inspected project.
