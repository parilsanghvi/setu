<!-- setu-governance-report -->
### Docs Drift Report 📝

🛑 **Docs Drift Detected: 50%**

- Changed Files: **2**
- Required Docs: **2**
- Missing Docs: **1**

#### Top Missing Paths

- `b`

#### Context & Reviewers

- Base Ref: **master**
- Source: **git diff**
- Ignored Files: **1**

#### How to Fix
Run the following locally:
```bash
setu onboarding run --only-missing
```
Then verify with:
```bash
setu onboarding doctor --diff --strict-diff
```
