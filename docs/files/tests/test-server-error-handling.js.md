---
description: Tests for server error handling and security
---
# `tests/test-server-error-handling.js`

This script verifies the error handling and security properties of the core server endpoints. It tests that the API properly catches internal exceptions and returns generic error messages (like `Internal Server Error`) instead of leaking stack traces or sensitive environment details back to the client.
