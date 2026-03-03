---
title: "CoreAgent Path Traversal Prevention Test"
description: "Security test to ensure CoreAgent isolates path access."
---
# Path Traversal Prevention Test
This script verifies that the `CoreAgent` path resolution mechanism correctly prevents access to paths escaping its designated scope. It attempts to traverse the directory tree upward using dot-dot-slash notation and absolute paths outside the allowed working directory. If these access attempts are correctly rejected by the underlying isolation checks, the test will pass, demonstrating that the agent is properly constrained to its sandbox environment.
