# tests/test-socket-auth.js

Test suite to verify the `socketAuth` middleware functionality.

## Coverage
- Handles missing authorization header.
- Handles authorization header with incorrect format (missing 'Basic' prefix).
- Handles authorization header lacking a base64 string or colon separator.
- Rejects requests with invalid credentials using mocked `basicAuth.validate`.
- Successfully calls `next()` when valid credentials are provided.
