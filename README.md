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

| Skill | What it does |
|---|---|
| [systems-thinking](skills/systems-thinking/) | Reason about problems and decisions as dynamic systems — stocks and flows, feedback loops, delays, nonlinearity, adaptive actors, and policy resistance — instead of linear problem→solution chains. |

Each skill's own `README.md` has the full write-up (what it does, design notes, how to adapt it); `SKILL.md` is the agent-facing instructions. New skills land as sibling folders under `skills/` — see [Layout](#layout).

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
