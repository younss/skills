# younss-skills

[![skills.sh](https://skills.sh/b/younss/skills)](https://skills.sh/younss/skills)

A growing collection of portable agent skills — plain Markdown, `name` + `description` frontmatter, no vendor lock-in. Works across Claude Code, Codex, Cursor, Gemini CLI, and anything that can read a system prompt.

## Install

### Option A — via [skills.sh](https://skills.sh) (recommended)

Works across 70+ agents (Claude Code, Codex, Cursor, Cline, GitHub Copilot, ...) via the shared [`skills`](https://github.com/vercel-labs/skills) CLI. No clone, no dependency added to your project.

```bash
npx skills add younss/skills --list              # see what's packaged before installing
npx skills add younss/skills --skill systems-thinking   # install just that one skill
npx skills add younss/skills                     # install every skill in this repo
```

### Option B — this repo's own installer

Zero dependencies (Node built-ins only), and covers a couple of targets the shared CLI doesn't — Cursor rules, Gemini CLI extensions, an arbitrary `--dir`, and `print` for pasting a skill straight into a system prompt.

```bash
npx github:younss/skills install systems-thinking   # install just that one skill
npx github:younss/skills                            # install every skill, to ~/.claude/skills/
```

That copies into `~/.claude/skills/`, where Claude Code picks it up automatically.

<details>
<summary>Other targets</summary>

```bash
npx github:younss/skills install systems-thinking --codex        # ~/.agents/skills — Codex CLI, IDE and app
npx github:younss/skills install systems-thinking --codex-repo   # ./.agents/skills — commit it with your repo
npx github:younss/skills install systems-thinking --project      # ./.claude/skills — commit it with your repo
npx github:younss/skills install systems-thinking --cursor       # ./.cursor/rules
npx github:younss/skills install systems-thinking --gemini       # ~/.gemini/extensions — Gemini CLI, personal
npx github:younss/skills install systems-thinking --gemini-repo  # ./.gemini/extensions — commit it with your repo
npx github:younss/skills install systems-thinking --dir ./skills # anywhere else
npx github:younss/skills list                                    # what's packaged, with descriptions
npx github:younss/skills targets                                 # list install targets
```

(Drop `systems-thinking` from any of the above to install every packaged skill instead of just one.)

</details>

For frameworks with no skill loader (the Claude API, LangGraph, CrewAI, AutoGen, the OpenAI Agents SDK), print a skill straight into a system prompt — or mount the skill's folder directly and read `SKILL.md` yourself:

```bash
npx github:younss/skills print systems-thinking --refs > systems-thinking.md
```

Once published to npm, `npx younss-skills` works identically to `npx github:younss/skills`.

Building a router or tool-selection layer instead? Use a skill's `description` field verbatim as the routing description.

## Skills

A software product delivery team, one skill per role — genericized from a real production codebase and stripped of any company/product specifics, and scoped to the roles that actually sit on a delivery team (product, engineering, design, security) rather than adjacent org functions like HR, legal, marketing, or support. Deduplicated on purpose: product strategy and spec-writing are one skill (most delivery teams can't staff both separately), security review and red-team probing are one skill, UX design and UX audit are one skill, and privacy/data-protection compliance is a section of the security-review skill rather than a separate near-duplicate checklist.

**Reasoning**

| Skill | What it does |
|---|---|
| [systems-thinking](skills/systems-thinking/) | Reason about problems and decisions as dynamic systems — stocks and flows, feedback loops, delays, nonlinearity, adaptive actors, and policy resistance — instead of linear problem→solution chains. |

**Product**

| Skill | What it does |
|---|---|
| [product-manager](skills/product-manager/) | Spec a feature with acceptance criteria and YAGNI discipline, or make a strategic call — RICE prioritization, Blue Ocean/ERRC, pricing, PLG mechanics. |

**Engineering**

| Skill | What it does |
|---|---|
| [backend-developer](skills/backend-developer/) | Backend conventions: error handling, background jobs, config-driven behavior, PII handling, tenant isolation where multi-tenant. |
| [frontend-developer](skills/frontend-developer/) | UI component work in any framework (illustrated with React): accessibility, responsive/mobile-first layout, i18n/RTL, data viz, performance. |
| [data-architect](skills/data-architect/) | Relational schema design: migrations, integrity, PII/compliance, query performance, tenant isolation where multi-tenant. |
| [solution-architect](skills/solution-architect/) | System-wide architecture: API design, ADRs, scalability/security tradeoffs, AI/LLM pipeline architecture. |
| [qa-test-engineer](skills/qa-test-engineer/) | Full test pyramid — unit/integration, UI/e2e, and manual/exploratory QA (test plans, bug reports) — for any stack. |
| [devops-sre-specialist](skills/devops-sre-specialist/) | CI/CD gates, the four golden signals, environment parity, resilience patterns, IaC. |
| [engineering-standards-guardian](skills/engineering-standards-guardian/) | Enforce SOLID/DRY, TDD, layered architecture, and YAGNI against a project's own constitution (or sane defaults). |

**Security**

| Skill | What it does |
|---|---|
| [security-review](skills/security-review/) | Static review (OWASP/ISO 27001/NIST/CIS, secrets scanning, a GDPR-style privacy baseline, LLM-output safety) or active red-team probing of a running system. |

**Design**

| Skill | What it does |
|---|---|
| [ux-designer](skills/ux-designer/) | Design new components and audit existing UI against your design system, WCAG 2.1 AA, responsive rules, and (if applicable) monetization-gating UX. |

Each skill's own `README.md` (where present) has the full write-up (what it does, design notes, how to adapt it); `SKILL.md` is always the agent-facing instructions and is the only required file. New skills land as sibling folders under `skills/` — see [Layout](#layout).

## Layout

```
skills/                    # this repo (younss/skills)
├── bin/cli.js              # zero-dependency installer, discovers every skills/<name>/
├── skills/
│   └── systems-thinking/
│       ├── SKILL.md        # agent-facing instructions (required)
│       ├── README.md       # human-facing write-up (optional)
│       └── references/     # loaded only when a stage needs the detail (optional)
└── package.json
```

The only hard requirement is `skills/<name>/SKILL.md` with `name` + `description` frontmatter — that's what the installer and skills.sh both discover automatically, no registration step. `description` can't contain an unquoted `word": word` (a bare colon-space in a plain scalar reads as a nested mapping to some YAML parsers, skills.sh's included) — wrap it in a block scalar (`>-`) if it needs one.

## Requirements

Node 18+ for the installer. Skills themselves are plain Markdown and have no runtime requirements at all.

## License

MIT
