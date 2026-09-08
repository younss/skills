---
name: qa-test-engineer

description: >-
  Use this skill for QA and test-engineering work on any kind of project — writing/extending automated tests at any layer (unit, integration, end-to-end/UI), reasoning about what an existing suite does and doesn't cover, and manual/exploratory QA (test plans, release regression checklists, bug reports) for what automation doesn't reach. Illustrated with a Jest-like backend test runner and Playwright/Cypress-style e2e as the default examples — adapt to pytest/RSpec/Go testing/JUnit/XCTest/etc. and whatever e2e or manual process your project actually uses. Distinct from an engineering-standards-guardian skill, which checks TDD compliance after the fact — this skill owns writing and maintaining the tests (and test process) themselves.
---

# QA / Test Engineer

You write tests that match the codebase's existing conventions exactly — read a few neighboring test files before writing a new one; don't introduce a second testing style. Pick the layer(s) below relevant to the project at hand: a backend-only service mostly needs unit/integration; a frontend-heavy or full-stack product also needs UI/e2e coverage and often a manual-QA pass for anything automation can't reliably assert (visual polish, subjective UX, one-off exploratory sessions before a release).

## Unit & Integration Tests (Illustrative: Backend Service)

### Suite Layout (adapt paths to your project)

- **`unit/`** — mocked dependencies (DB client, external services), fast, runs on every test invocation. Mirrors the source tree: `unit/controllers/`, `unit/services/`, `unit/middleware/`, `unit/utils/`.
- **`integration/`** — exercises the real route/handler layer with mocked persistence.
- **`integration-real/`** (if present) — spins up real infrastructure (DB, cache) via testcontainers or similar; usually excluded from the default fast test run and executed as a separate CI job because it needs Docker/Podman. Never place a container-dependent test under `unit/` or plain `integration/` — it will silently never run in the fast path.
- **`helpers/`** — shared mock factories (an in-memory DB-client mock, an auth-token signer, integration test setup).
- **`benchmark/` or `fixtures/`** — sample input files for tests that parse real-world formats; not itself a test directory.

### Unit Test Conventions

A typical unit test file for a controller/service, in order:
1. **Environment shim** at the top: set every env var the module under test reads, *before* any `require`/`import`.
2. **Module mocks**, declared before the module under test is imported. Mock the persistence client via a shared mock factory helper — never hand-roll a database mock inline in each test file.
3. Mock every service the code under test calls (email, payments, third-party APIs, AI/LLM calls) with explicit per-test return/resolve values — don't let an unmocked call hit a real network or database.

Check your test runner's config for global settings that constrain how mocks behave (e.g. Jest's `clearMocks`, `resetModules`, `maxWorkers`) — these interact with mock hoisting and module caching in ways that aren't obvious from a single test file; don't flip them without understanding why they're set the way they are.

### Coverage

If the project has coverage thresholds gated on specific files, check whether a file you've substantially covered should be added to that gate list, rather than leaving thresholds permanently scoped to a stale set of files. Coverage percentage is a floor, not a goal — 100% line coverage with no assertions on behavior is worse than 70% coverage that actually exercises edge cases.

## UI / End-to-End Tests (If the Project Has a Frontend)

Illustrated with Playwright/Cypress-style tooling — adapt to Selenium, XCUITest/Espresso (mobile), or whatever your project already uses.

- Keep the e2e suite small and high-value: cover critical user paths (signup/login, the core happy path the product exists for, checkout/payment if applicable) — not exhaustive UI permutations, which belong in component-level unit tests instead.
- Select elements the way a user identifies them (visible text, ARIA role, an explicit `data-testid`) rather than CSS classes or DOM structure, which change for reasons unrelated to behavior and make tests flaky.
- Assert on explicit conditions (an element becoming visible, a network response resolving, a URL changing) rather than fixed `sleep`/`wait(ms)` calls — arbitrary waits are the single biggest source of flaky e2e suites.
- Run e2e as a separate, slower CI job from unit/integration (similar to an `integration-real` job) since it typically needs a real browser and a running app instance — don't block the fast feedback loop on it.
- Treat a flaky e2e test as a bug to fix (better selector, better wait condition) or delete — a test nobody trusts gets ignored, and an ignored failing test is worse than no test.

## Manual & Exploratory QA

Automation doesn't reach everything — subjective visual/UX quality, one-off edge cases, and pre-release confidence checks still benefit from a deliberate manual pass, even on a team with strong automated coverage.

- **Test plans**: for a release or feature, write a short checklist of the specific flows and edge cases to verify by hand (device/browser matrix if relevant, empty/error/loading states, permission boundaries) rather than relying on ad hoc clicking around.
- **Regression checklist**: maintain a living list of past bugs/critical flows to spot-check before a release; prune it as automated coverage absorbs an item, add to it when a bug automation missed makes it to production.
- **Bug reports**: structure every report with steps to reproduce, expected vs. actual behavior, environment (browser/OS/version/account state), severity, and a screenshot/recording where visual — a report missing repro steps just bounces back and forth before anyone can act on it.
- **Exploratory sessions**: time-boxed, undirected probing of a feature area outside the scripted test plan — the goal is to find what nobody thought to write a case for.

## What to Test

- **Tenant isolation** (if multi-tenant): every controller test touching tenant-scoped data should include a case proving a request scoped to tenant A cannot read or modify tenant B's data. This is usually the single most safety-critical behavior in the app — see a data-architect or security-review skill for why.
- **Authorization-tier gating** (if plan/role-gated): a case per tier/role where the route should be denied with a consistent structured error.
- **Error mapping**: a case that a thrown domain error produces the status/shape the centralized error handler expects, not a generic 500.
- **Encryption round-trip** (if applicable): for any new PII field, a case proving what's persisted is ciphertext and what's returned to the caller (when appropriate) is plaintext.
- **Boundary and negative cases**: empty input, maximum/oversized input, malformed input, and the "not found"/"not authorized" paths — not just the happy path.
- **Accessibility** (if the project has a frontend): at minimum a check that critical flows are keyboard-navigable and screen-reader-labeled — see a frontend-developer or ux-designer skill for the full standard.

## Self-Verification Checklist

Before finalizing a new or modified test file:
- [ ] Env shim covers every env var the module under test reads (backend unit tests)
- [ ] Persistence is mocked via the shared helper, not hand-rolled
- [ ] Every external service call in the path under test is mocked
- [ ] At least one test proves cross-tenant isolation, if the code touches tenant-scoped data
- [ ] Container/real-infra-only and e2e tests are not placed under the fast unit/integration path
- [ ] New e2e tests use resilient selectors (role/text/test-id) and explicit waits, not sleeps
- [ ] The full test command passes locally before calling the work done
