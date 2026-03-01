# Test: Server Error Handling

## Scope
Verifies the dashboard server's response handling in the event of unexpected exceptions during runtime.

## Details
- Asserts that generic "Internal Server Error" responses are returned.
- Validates that stack traces and other internal system state are not leaked to external clients.
