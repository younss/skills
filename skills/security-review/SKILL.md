---
name: security-review

description: >-
  Perform a comprehensive security review of code changes, components, or architecture — either as a static review against OWASP Top 10 / ISO 27001 / NIST / CIS checklists and secrets scanning, or as active red-team probing (reconnaissance, systematic exploitation attempts, a hack report) of a running system. Covers PII handling and data-privacy compliance (lawful basis, data subject rights, retention, breach notification, cross-border transfers) with a jurisdiction-agnostic GDPR-style baseline, plus LLM-output safety for AI-backed products. Use for pre-merge review, pre-launch audits, or when asked to probe a system's defenses.
---

# Security Review

Perform a security review of the code, component, or architecture described in ARGUMENTS (or of all recent git changes if no arguments are given). Pick **Mode 1** for a static code/architecture review, **Mode 2** when asked to actively probe a running system ("red team this", "try to break in").

## Mode 1 — Static Review

### Step 1 — Determine scope
If ARGUMENTS specify a file, component, or feature, focus there. If empty or "full", review the staged/unstaged diff and recent commit history:
```bash
git diff HEAD~10..HEAD --stat
git diff HEAD
```

### Step 2 — Gather context
Read the relevant source. For backend changes, also read config/env declarations, auth and rate-limiting middleware, and the data model. For frontend changes, also read token-storage code and the HTTP client config (interceptors, base URL, credential handling).

### Step 3 — Run the review
For every finding, record: **Location** (file:line), **Finding** (what's wrong), **Risk** (what an attacker could do), **Remediation** (specific fix, with code if applicable).

## Review Checklist

### OWASP Top 10 (2021)

**A01 — Broken Access Control**
- [ ] Every protected route enforces authentication/authorization at the right level (user / admin / super-admin)
- [ ] Tenant isolation: all DB queries scoped to the tenant key
- [ ] No IDOR: resource ownership verified before access
- [ ] Horizontal privilege escalation impossible (a user cannot access another user's data)
- [ ] Vertical privilege escalation impossible (a lower role cannot invoke higher-role-only actions)

**A02 — Cryptographic Failures**
- [ ] Sensitive data (passwords, tokens, API keys) never stored in plaintext
- [ ] Tokens hashed with a strong algorithm (SHA-256+, never MD5/SHA-1)
- [ ] TLS enforced for all external connections (no disabled certificate verification)
- [ ] Secrets not in code, comments, or logs
- [ ] JWT algorithm explicitly fixed server-side (never trusted from the token header)

**A03 — Injection**
- [ ] All DB queries parameterized (via ORM or prepared statements) — no raw string concatenation
- [ ] Shell commands: no user input in `exec`/`spawn` without sanitization
- [ ] LLM prompts: user-controlled input cannot escape the intended role/system-prompt context
- [ ] Templates (email, HTML): output encoded; no template injection

**A04 — Insecure Design**
- [ ] Rate limiting on all authentication and sensitive endpoints
- [ ] No business logic that can be abused (negative amounts, quota bypass)
- [ ] Quota and plan/tier enforcement is server-side, never trusting client-supplied claims

**A05 — Security Misconfiguration**
- [ ] No debug endpoints or verbose error messages in production paths
- [ ] CORS restricted to known origins — never a wildcard in production
- [ ] Security headers (CSP and equivalents) applied
- [ ] No unnecessary HTTP methods enabled

**A06 — Vulnerable Components**
- [ ] No packages with a known critical CVE and no available patch
- [ ] Lock files not modified unexpectedly
- [ ] No abandoned packages handling auth or crypto

**A07 — Authentication Failures**
- [ ] Magic links / one-time tokens: single-use, hashed, short TTL
- [ ] Refresh tokens: rotation on use, revocation on logout
- [ ] API keys: hashed at rest, only a display prefix stored in the clear
- [ ] Brute-force protection on auth endpoints

**A08 — Software and Data Integrity**
- [ ] LLM output validated against a schema before use
- [ ] Webhook signatures verified (payment provider, email provider, etc.)
- [ ] No `eval()`, `Function()`, or dynamic code execution on external input

**A09 — Logging Failures**
- [ ] No PII (email, name, uploaded content) in log lines
- [ ] Security events logged (auth failures, quota violations, webhook errors)
- [ ] Logs structured (JSON) — no concatenated sensitive strings

**A10 — SSRF**
- [ ] User-supplied URLs pass through a hardened fetch wrapper (private-IP blocklist, size cap, timeout)
- [ ] No server-side fetch of arbitrary user URLs outside that wrapper

### ISO/IEC 27001:2022 — Annex A Spot Checks

| Control | Check |
|---|---|
| A.5.1 — Policies | Security config validated at startup; fail-fast on missing secrets |
| A.5.15 — Access control | Least privilege: roles scoped to minimum required permissions |
| A.8.2 — Privileged access | Elevated actions require an explicit elevated-role check, separate from standard admin |
| A.8.7 — Malware protection | Dependencies scanned; no known-vulnerable packages |
| A.8.12 — Data leakage prevention | PII not logged; no sensitive data in error responses |
| A.8.24 — Cryptography | Approved algorithms only (AES-256, SHA-256, RS256/HS256 JWT) |
| A.8.28 — Secure coding | Parameterized queries; input validation at entry points; output encoding |

### NIST CSF 2.0 — Key Controls

| Function | Check |
|---|---|
| Govern (GV) | Secrets in vault/env; no hardcoded credentials |
| Identify (ID) | Data inventory maintained; schema documents PII fields |
| Protect (PR) | Auth enforced; encryption in transit and at rest |
| Detect (DE) | Error and security events logged at appropriate level |
| Respond (RS) | Error handler returns structured errors without stack traces in production |
| Recover (RC) | Retry with exponential backoff; health endpoint monitored |

### CIS Controls v8 — Essential Hygiene (IG1)
- [ ] CIS-1: software inventory — all dependencies declared in a lock file
- [ ] CIS-3: data protection — PII encrypted at rest; TLS in transit
- [ ] CIS-5: account management — no default credentials; API keys rotatable
- [ ] CIS-6: access control management — least privilege applied
- [ ] CIS-8: audit log management — structured logs; no PII in logs
- [ ] CIS-12: network infrastructure — private ports not exposed; rate limiting active
- [ ] CIS-16: application security — input validation; output encoding; LLM output validation

### Secrets & Configuration Audit
Scan the diff for hardcoded API keys/tokens/passwords/connection strings; log calls that could emit secrets or PII; `.env` files committed without `.gitignore` protection; raw environment values used without going through a validated config layer.

### Data Privacy & Compliance (GDPR-Style Baseline)
Run this whenever the change touches personal data, regardless of which specific privacy law applies — it's a jurisdiction-agnostic baseline modeled on GDPR (the broadest widely-adopted framework); layer on jurisdiction-specific detail yourself where you have a real compliance obligation (a named regulator, an enterprise DPA, a specific export market) instead of guessing at the specifics of laws you haven't confirmed apply.

- [ ] **Lawful basis**: every new processing activity has a documented basis (consent / contract / legal obligation / legitimate interest); sensitive/special-category data (health, biometric, genetic, ethnicity, religion, sexual orientation, criminal history, children's data) has explicit consent or another recognized special basis.
- [ ] **Data subject rights**: a path exists (or is unaffected) for access/export, rectification, erasure (cascading to every table/store holding that person's data), and portability. Flag any new PII-bearing table missing from the erasure cascade.
- [ ] **Retention**: if the entity has a stated retention limit, a purge job enforces it in code (TTL, cleanup cron) — not just in a policy document.
- [ ] **Encryption at rest**: any PII-bearing field (names, emails, documents, free-text user content, uploaded files) must be encrypted before persistence — flag any new PII-bearing column that skips this.
- [ ] **No PII in logs**: any log call with a name, email, phone number, or content fragment is a CRITICAL finding, not a style nit.
- [ ] **Breach notification readiness**: a detection mechanism and a documented path to notify the relevant regulator/customers exist (most jurisdictions converge near a 72-hour window).
- [ ] **Cross-border transfers**: a transfer to a jurisdiction without an adequacy decision uses an approved mechanism (SCCs or equivalent) — flag any *new* third-party integration or sub-processor that receives personal data as an explicit call-out, not a silent addition.
- [ ] **Vendor/processor agreements**: a DPA (or equivalent) exists with every third party that touches personal data.

If the product has an AI/LLM pipeline:
- **LLM output is untrusted input**: every model JSON response must be schema-validated before use — flag any code path that renders or persists LLM output without going through schema validation first.
- **LLM-generated text in the UI**: flag any direct `innerHTML`/`dangerouslySetInnerHTML`-style assignment of AI-generated text — most frameworks' default escaping covers interpolation, but raw-HTML injection points need explicit verification.
- **Automated decision-making**: if the system's output drives a decision with legal or significant effect on a person (hiring, lending, eligibility, etc.), disclose that a human-review path exists — don't let the model's output be the sole, undisclosed basis for the decision.

### Output Format (Mode 1)
```
## Security Review Report
**Scope**: [reviewed scope]
**Date**: [today]
**Frameworks**: OWASP Top 10 (2021) · ISO 27001:2022 · NIST CSF 2.0 · CIS Controls v8 · GDPR-style privacy baseline
**Overall Risk**: CRITICAL | HIGH | MEDIUM | LOW | PASS

### CRITICAL — Block merge
[ID] [Framework] — [Title]
- Location: file:line
- Risk: ...
- Remediation: ...

### HIGH — Fix before production
### MEDIUM — Fix within sprint
### LOW — Hardening

### Secrets Scan
[Result: CLEAN or findings]

### Approved / Blocked
[Explicit merge recommendation with conditions]
```

## Mode 2 — Active Probing (Red Team)

A structured, ethical "red team" pass against your own system to find and remediate flaws before an attacker does.

### 1. Reconnaissance
Gather intelligence on the target surface:
- Audit the auth middleware for missing checks.
- Review any PII-scrubbing/redaction logic for gaps.
- Map every database query to check for missing tenant-scope filters.

### 2. Systematic Testing
Run targeted tests for each attack vector in [references/attack-vectors.md](references/attack-vectors.md): PII-scrubber evasion, broken access control (IDOR, SSE/WebSocket hijacking, role escalation), prompt injection, auth/session race conditions, and billing/quota abuse.

### 3. Reporting
For every vulnerability found, produce a report:
- **ID**: e.g. `VULN-001`
- **Type**: e.g. Broken Access Control
- **Severity**: Critical | High | Medium | Low
- **Reproduction**: step-by-step instructions or script
- **Remediation**: the specific code change required

## Rules of Engagement
- Never use or store real user PII during a probing exercise.
- Use synthetic/mock data for every exploitation attempt.
- Focus on architectural flaws (missing middleware, missing scope filters) rather than one-off implementation bugs — the former recurs across the codebase, the latter is a single fix.
