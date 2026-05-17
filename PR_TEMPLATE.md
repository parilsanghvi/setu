🧪 Move socketAuth test to collocated file lib/middleware/socketAuth.test.js

🎯 **What:**
The testing gap addressed: Missing test file specifically co-located with `lib/middleware/socketAuth.js`. The test file `tests/test-socket-auth.js` has been moved to `lib/middleware/socketAuth.test.js` to correctly follow the project's convention for module tests.

📊 **Coverage:**
What scenarios are now tested:
- Missing authorization header
- Malformed header - Missing "Basic"
- Malformed header - Extra parts
- Malformed credentials - Not Base64 / no colon
- Invalid credentials
- Valid credentials

✨ **Result:**
The improvement in test coverage: Coverage remains at 100%, but the test is properly aligned with expected paths, improving maintainability and ensuring the test runner and issue tracker will locate the tests for the module.
