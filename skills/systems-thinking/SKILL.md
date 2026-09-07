---
name: systems-thinking

description: >-
  Analyze problems and decisions as dynamic systems — stocks and flows, feedback loops, delays, nonlinearity, adaptive actors, and policy resistance — instead of as linear problem-to-solution chains. Use this whenever a request involves diagnosing why something keeps happening, deciding on an intervention, evaluating a strategy or policy, predicting second- and third-order consequences, or explaining behaviour that persists despite prior fixes. Trigger it even when the user does not say "system": phrases like "why does this keep happening", "should we do X", "the fix didn't stick", "unintended consequences", "root cause", "this metric is getting worse", "we tried adding more people", or any recommendation touching multiple teams, incentives, or time horizons are all signals to use it.
---

# Systems Thinking for Decisions and Diagnosis

## What this changes about your reasoning

Default reasoning is a chain:

```
Problem → Solution → Result
```

This skill replaces it with a loop:

```
Perceived problem → Decision → Intervention → System changes →
Actors adapt → Feedback develops → Stocks accumulate/deplete →
Behaviour changes → New information observed → Perception updates → New decision ↺
```

Treat the system as dynamic, adaptive, interconnected, nonlinear, partially observable, delayed, and path-dependent. The goal is never just to fix the visible problem. It is to understand the structure that *produces* the problem, and to predict what new system your intervention will create.

Four commitments carry most of the value. Hold them throughout:

1. **No open-loop decisions.** Every consequence feeds back — into the system, other actors, and the decision-maker's next decision. Trace the return path.
2. **There are no side effects.** Unexpected consequences are effects of the system that your model omitted. When one appears, ask what was missing, then widen the boundary.
3. **Assume policy resistance.** Ask who will perceive their goals as threatened and what corrective action they will take. Model the resistance loop explicitly before recommending.
4. **The boundary is a choice, not a fact.** Any unexplained variance, external factor, or resistance is a prompt to ask: is this actually endogenous?

## Step 0 — Calibrate depth before analyzing

Full analysis is expensive and disproportionate for small reversible decisions. Pick a tier, say which one you picked, and escalate mid-analysis if the situation turns out to be larger than it looked.

| Tier | Use when | Do |
|---|---|---|
| **Scan** | Reversible, low cost of failure, few actors, effects visible within days | Frame → one iceberg pass → name the 1–2 dominant loops → one delay → one resistance mechanism → signals to monitor. A few paragraphs. |
| **Standard** (default) | A real decision with consequences across teams, budgets, or quarters | Run all six stages below at moderate depth. 3 competing hypotheses, 2–3 candidate interventions including "do nothing". |
| **Full** | Irreversible, expensive, politically contested, or a problem where prior fixes already failed | Every phase in `references/analysis-phases.md`, full report from `references/output-template.md`. |

Escalate a tier when any of these appear: the intervention is hard to reverse; failure is expensive or unsafe; three or more actors have conflicting goals; important effects land months or years later; a previous fix produced short-term improvement then relapse; the intervention is a target or metric that people can game.

**Do not use this skill** for factual lookups, single-step tasks, or genuinely simple causal questions. Applying it there produces bloated answers and buries the actual response. If the honest analysis is "this really is a simple linear problem", say so and answer directly.

## Step 0.5 — Ground the frame and actors with the user (Standard/Full, interactive)

Skip this for Scan tier — speed is the point there — and skip it whenever there's no one to answer: a batch pipeline, an API call expected to return one final answer, an autonomous run with no back-and-forth. In those cases go straight into the six stages and let the Known/Assumed/Unknown split in the Uncertainties section carry what you couldn't check, as before.

Otherwise, don't build Stage 3's model on guesses about things that only exist in the user's head: the decision-maker's real authority, what's already been tried and how it actually went, an actor's true incentive, which side of the boundary something belongs on, whether a metric is already being gamed. A guess you later label "Assumed" cost you accuracy that one question would have bought for free while the user was right there to answer it.

Ground it stage-by-stage rather than all at once — later stages depend on earlier answers, so asking them out of order just produces questions built on unstated assumptions:

1. **Ground the frame first.** Before committing to Stage 1's decision, decision-maker, trigger, boundary, and time horizon, put your best-guess version of each to the user and let them correct it.
2. **Ground the actors and stocks once the frame holds.** Only after the frame is settled, do the same for Stage 3's material: who the real actors are, what they actually want, what's quietly accumulating that the numbers don't show, what's already been tried and how it played out.
3. **Ground suspected resistance last, and only if it would change the call.** If you suspect a specific actor will resist, or a metric will get gamed, and confirming that would change which intervention you'd recommend, ask before Stage 5 rather than assume it.

Put each pass as a short numbered list, and give every item your own default so the user can wave most of them through instead of re-deriving them from scratch:

```
1. <what needs settling> — <the specific question>
   Default if you don't correct me: <your best guess>

2. <what needs settling> — <the specific question>
   Default if you don't correct me: <your best guess>
```

Anything answerable without the user — from code, logs, tickets, metrics, git history, prior write-ups — is yours to go find, not theirs to be asked: look it up yourself, or dispatch a sub-agent, instead of spending a question on it. Reserve questions for what only the user can know: their intent, their authority, an actor's real motive, what actually happened last time this was tried.

Stop grounding once you can honestly answer the confidence gate's ten questions below without guessing — or once the user tells you to proceed with the remaining gaps left flagged as assumptions. Treat this as done when nothing load-bearing is still unstated, not as a fixed number of passes.

## The six stages

Each stage names the phases it covers. Read `references/analysis-phases.md` for the full protocol of any stage you are working in depth — it holds the questions, checklists, and templates that make each phase concrete.

### Stage 1 — Frame (Phase 1)
State the decision, the desired outcome, the observable trigger, the decision-maker and their authority, the time horizons (immediate / short / medium / long, considered separately), the initial boundary, and — critically — what may have been wrongly placed outside it. Interactively at Standard/Full tier, settle these with the user via Step 0.5 rather than asserting them.

### Stage 2 — Descend below the waterline (Phase 2)
Walk the iceberg: events → patterns over time → structures (process, incentive, information flow, governance, architecture) → mental models → hidden system (trust, informal power, fear, tacit knowledge, technical debt, fatigue, information asymmetry). Never stop at events. The structures level is where interventions actually land; the mental models level is where they last.

### Stage 3 — Build the structural model (Phases 3–9)
- **Stocks and flows.** What accumulates or depletes? Never confuse a flow with a stock — hiring is not workforce capability, training activity is not accumulated skill, acquisition is not customer base.
- **Actors as adaptive agents.** For each significant actor: current state, desired state, perceived gap, incentives, constraints, information, authority, likely reaction to your intervention. Actors are never passive components.
- **Goal conflicts.** When you move the system toward your goal, whose state moves away from theirs?
- **Causal links.** Mark sign, delay, confidence, conditionality, and nonlinearity on each link.
- **Feedback loops.** Label reinforcing (R1, R2…) and balancing (B1, B2…) loops, including the loop that feeds back into the decision-maker.
- **Delays.** Ask directly: could this appear to improve before deteriorating? Could it appear unchanged while a stock quietly fills?
- **Nonlinearity.** Look for thresholds, saturation, tipping points, interaction effects, path dependence, hysteresis, regime change.

### Stage 4 — Stress the model (Phases 10–16)
Challenge causality (could B cause A? could C cause both?). Model policy resistance and metric gaming. Trace effects recursively — who benefits, who absorbs the cost, which stock moves, which future decision it shapes. Check whether the outcome could be **emergent** from locally rational behaviour with no bad actor anywhere. Generate at least three competing hypotheses and name the evidence that would separate them. Run counterfactuals: do nothing, do the opposite, central assumption false, intervention succeeds twice as well as expected. Identify the true constraint, and don't optimize a component that isn't constraining the system.

### Stage 5 — Choose the intervention (Phases 17–18)
Rank candidate leverage points: parameters and resources are low leverage; flows, information access, incentives, rules, and feedback timing are medium; goals, decision rights, structure, mental models, and the system's capacity to learn are high. Prefer structural change over repeated symptom treatment — but prefer a workable medium-leverage move over a high-leverage one nobody will authorize. Then test each candidate on the robustness dimensions (reversibility, cost of failure, delays, tipping points, hidden dependencies, adaptability, learning value). Favour robustness across futures over optimality in one predicted future.

### Stage 6 — Hunt blind spots, then report (Phases 19–21)
Ask: *what would need to be outside our model for this recommendation to fail?* Search specifically for omitted actors, hidden incentives, missing stocks, undocumented dependencies, missing loops, and threshold effects. If a plausible blind spot materially changes the recommendation, revise the model before writing. Then produce the system map and the report.

## Output

Match output shape to tier. For Scan, write prose that still names loops, delays, and resistance explicitly. For Standard and Full, use the report structure in `references/output-template.md`.

Whatever the tier, every recommendation must state:

- **What structure it changes** (not just what it does)
- **Expected feedback response** and **expected policy resistance**
- **Key assumptions** and **major uncertainties**, separated into known / assumed / unknown
- **Signals to monitor** — observable early indicators, including the ones that would show it failing
- **Conditions requiring reconsideration**

Include a compact causal map, with loops labelled separately. Default to a Mermaid diagram — Claude Code, GitHub, GitHub Copilot, Codex, ChatGPT, and most other current tools render `mermaid` fences natively, so it displays as an actual graph almost everywhere this output lands. Add the ASCII version too whenever the output might be read raw — a plain terminal stream, a piped log, a CI console — where a mermaid fence would otherwise show up as unrendered text. See `references/patterns.md` for both formats, the notation-to-Mermaid mapping, and when one alone is enough.

## Confidence gate

Do not present a high-confidence recommendation unless you can reasonably answer all ten:

1. What system generates the observed behaviour?
2. Which stocks are changing?
3. Which feedback loops dominate?
4. Which actors will react?
5. What policy resistance may emerge?
6. What delays hide the real effects?
7. Which relationships are nonlinear?
8. Which assumptions carry the recommendation?
9. What important effects may lie outside the boundary?
10. What would need to be missing from the model for this to fail?

If several are unanswerable, say so plainly, lower the stated confidence, and specify what must be learned and how — a probe, an experiment, a reversible pilot, or an instrument. Naming the gap is more useful than a confident answer built on an unexamined assumption.

## Anti-patterns

Never: treat the visible event as the real problem; assume actors stay passive; optimize one variable in isolation; read correlation as causation; assume proportionality; extrapolate linearly across system states; ignore delays; confuse stocks with flows; call inconvenient consequences "side effects"; treat the initial boundary as fixed; recommend without modelling resistance; assume reversing an intervention restores the prior state; or trade long-term dynamics for short-term performance without saying so.

## Reference files

Load these as needed rather than all at once:

- **`references/analysis-phases.md`** — the full 20-phase protocol with the questions and templates for each. Read the sections for whichever stage you're working in depth.
- **`references/output-template.md`** — the 21-section report structure, the per-candidate dynamic-consequence chain, and the robustness table.
- **`references/patterns.md`** — causal notation, loop archetypes, the nonlinearity taxonomy, the actor template, stock/flow discipline, and a worked micro-example.
