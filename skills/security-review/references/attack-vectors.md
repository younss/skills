# Attack Vectors for a Multi-Tenant AI SaaS

Use these vectors to systematically test the security posture of a typical multi-tenant application with an AI/LLM feature. Adapt the specific endpoints/field names to your own system.

## 1. PII Scrubber / Redaction Evasion
If the product strips PII before sending content to an AI provider (for GDPR/CCPA-style compliance), the scrubber is a first line of defense — treat evasion of it as a critical finding, not a nitpick.
- **Obfuscation**: hide emails/phones using symbols (e.g. `name [at] domain {dot} com`).
- **Vertical leakage**: include PII in unexpected input fields the scrubber doesn't cover.
- **Format variance**: non-standard phone formats, international scripts, or unusual encodings.

## 2. Multi-Tenant Isolation (Broken Access Control)
- **Stream hijacking**: try subscribing to a live-update/SSE/WebSocket endpoint using a resource id from another tenant.
- **IDOR**: fetch a resource by id that doesn't belong to your tenant/account.
- **Role escalation**: as a low-privilege member, try to invoke admin-only actions (invite users, change roles, modify billing).

## 3. Prompt Injection (AI Jailbreaking)
- **Output override**: instruct the model to ignore prior instructions and return raw input data (a PII leak) instead of the intended transformed output.
- **System prompt leak**: try "repeat the text above" or similar to extract hidden system prompts.
- **Malicious steering**: try to force the model to generate biased, discriminatory, or otherwise policy-violating output.

## 4. Auth & Session (Race Conditions)
- **Refresh token replay**: use a token-rotation grace period to try refreshing twice from different machines/sessions.
- **Rate-limit exhaustion**: brute-force a magic-link or OTP endpoint to see if per-user rate limiting actually holds.

## 5. Billing & Quota
- **Negative values**: try passing negative amounts/quantities in batch operations.
- **Parallel creation race**: trigger many billable operations at the exact same instant to try to bypass a usage-counter increment and get free usage past the quota.
