# systems-thinking

A portable agent skill that makes an LLM reason about problems and decisions as **dynamic systems** — stocks and flows, feedback loops, delays, nonlinearity, adaptive actors, and policy resistance — instead of as linear problem→solution chains.

Most agents answer `Problem → Solution → Result`. This skill makes them close the loop:

```
Perceived problem → Decision → Intervention → System changes →
Actors adapt → Feedback develops → Stocks accumulate/deplete →
Behaviour changes → New information observed → Perception updates → New decision ↺
```

## Install

```bash
npx github:younss/system-thinking
```

That copies the skill into `~/.claude/skills/systems-thinking`, where Claude Code picks it up automatically. No clone, no build step, no dependencies.

Other targets:

```bash
npx github:younss/system-thinking install --codex        # ~/.agents/skills — Codex CLI, IDE and app
npx github:younss/system-thinking install --codex-repo   # ./.agents/skills — commit it with your repo
npx github:younss/system-thinking install --project     # ./.claude/skills — commit it with your repo
npx github:younss/system-thinking install --cursor      # ./.cursor/rules
npx github:younss/system-thinking install --gemini      # ~/.gemini/extensions — Gemini CLI, personal
npx github:younss/system-thinking install --gemini-repo # ./.gemini/extensions — commit it with your repo
npx github:younss/system-thinking install --dir ./skills # anywhere else
npx github:younss/system-thinking targets               # list them
```

For frameworks with no skill loader (LangGraph, CrewAI, AutoGen, the OpenAI Agents SDK), print the method straight into a system prompt:

```bash
npx github:younss/system-thinking print --refs > systems-thinking.md
```

Once published to npm, `npx system-thinking-skill` works identically.

## What it does

The skill triggers on decision and diagnosis work — including when the user never says "system". Phrases like *why does this keep happening*, *the fix didn't stick*, *unintended consequences*, or *should we do X* all route to it.

It then runs six stages:

| Stage | What it produces |
|---|---|
| 1. Frame | Decision, decision-maker, time horizons, and what was wrongly left outside the boundary |
| 2. Below the waterline | Events → patterns → structures → mental models → hidden system |
| 3. Structural model | Stocks and flows, adaptive actors, goal conflicts, causal links, R/B loops, delays, nonlinearity |
| 4. Stress the model | Causality challenge, policy resistance, recursive effects, emergence, competing hypotheses, counterfactuals, the true constraint |
| 5. Intervention | Leverage ranking, robustness across futures |
| 6. Blind spots | What would have to be missing for this to fail — then the report |

Every recommendation has to state what *structure* it changes, the feedback and resistance it will meet, its load-bearing assumptions, and the signals that would show it failing.

**It grounds the model with the user before building it.** In an interactive session at Standard/Full tier, Stages 1–3 need facts that only live in the user's head — real decision authority, what's already been tried, actors' true incentives. Instead of guessing and flagging the guess as "Assumed," the skill grounds each stage in turn: it puts its best-guess frame to the user first, then (once that holds) its best-guess actors and stocks, each as a short numbered list with a default the user can just wave through. It stops once the confidence gate's ten questions are honestly answerable, not after a fixed number of questions. Facts the environment can answer (code, logs, tickets, git history) are looked up, never asked. Non-interactive runs (an API call, a batch pipeline) skip this and fall back to the assume-and-flag behavior, since there's no one there to answer.

**Diagrams render, not just describe.** Causal maps default to Mermaid — Claude Code artifacts, GitHub, GitHub Copilot, Codex, ChatGPT, and most other current tools render `mermaid` fences natively, so the loop structure shows up as an actual picture almost everywhere this output lands. The skill still emits the ASCII version alongside it whenever the destination might be a raw terminal, a piped log, or any other surface that won't render Mermaid — so the map stays legible either way.

## Layout

```
system-thinking/
├── bin/cli.js                          # zero-dependency installer
├── skills/systems-thinking/
│   ├── SKILL.md                        # triage, six stages, output contract, confidence gate
│   └── references/
│       ├── analysis-phases.md          # the full 20-phase protocol
│       ├── output-template.md          # the 21-section report structure
│       └── patterns.md                 # notation, archetypes, actor template, worked example
└── package.json
```

**Progressive disclosure.** Only the frontmatter (~110 words) stays in context. `SKILL.md` loads when the skill triggers. References load only when a stage is worked in depth — the full method is available without paying for it every turn.

**Depth triage.** `SKILL.md` opens with a Scan / Standard / Full ladder and explicit escalation triggers (irreversibility, gameable metrics, prior fixes that relapsed), plus a clause telling the agent *not* to use it on simple questions. Without that, a method this thorough either gets ignored or turns three-line answers into essays.

**Runtime-neutral.** Plain Markdown, `name` + `description` frontmatter only, relative reference paths, no scripts inside the skill, no vendor syntax.

## Compatibility

| Runtime | How |
|---|---|
| Claude Code, Claude Desktop | `npx github:younss/system-thinking` — auto-discovered |
| Codex CLI, IDE extension, Codex app | `--codex` (personal) or `--codex-repo` — auto-discovered from `.agents/skills` |
| Claude API / Agent SDK | Mount the folder, or inline `SKILL.md` into the system prompt |
| Cursor, Windsurf | `--cursor`, then set the rule to Always or Agent Requested |
| Gemini CLI | `--gemini` (personal) or `--gemini-repo` — installed as an extension under `.gemini/extensions`, auto-discovered on next start |
| OpenAI Agents SDK, LangGraph, CrewAI, AutoGen | `print --refs` into instructions, or index the folder for retrieval |
| Any router / tool-selection layer | Use the `description` field verbatim as the routing description |

## Adapting it

- **Narrow the domain.** Using this in one field only — infrastructure incidents, public policy, org design, banking operations — add a reference file with domain-specific stocks, actors, and archetypes. That is where most of the accuracy gain lives.
- **Tune the trigger.** Firing too often: tighten the description toward decision and diagnosis language. Too rarely: add the phrasings your users actually type.
- **Change the default tier.** Standard is the default; for high-stakes advisory work, make Full the default and require justification to go lower.

## Requirements

Node 18+ for the installer. The skill itself is plain Markdown and has no runtime requirements at all.

## License

MIT
