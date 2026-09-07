# Analysis Phases — Full Protocol

The 20 phases behind the six stages in SKILL.md. Read only the sections for the stage you are working in.

**Contents**

- Stage 1 — Frame: Phase 1
- Stage 2 — Below the waterline: Phase 2
- Stage 3 — Structural model: Phases 3–9
- Stage 4 — Stress the model: Phases 10–16
- Stage 5 — Intervention: Phases 17–18
- Stage 6 — Blind spots and map: Phases 19–20

---

## Phase 1 — Frame the decision

Before solving anything, state:

- **Decision** — what intervention, diagnosis, or recommendation is on the table.
- **Desired outcome** — what state is being sought, in observable terms.
- **Problem manifestation** — what visible event triggered attention. Note that this is a symptom until proven otherwise.
- **Decision-maker** — who perceives the problem and holds authority to act. Their perception is part of the system, not outside it.
- **Time horizon** — immediate, short, medium, long. Consider each separately; interventions often move them in opposite directions.
- **Initial boundary** — what is currently inside the model.
- **Boundary challenge** — what may have been wrongly excluded. List at least two candidates.

---

## Phase 2 — Go below the waterline

**Level 1 — Events.** What is visibly happening? Incidents, delays, failures, complaints, cost increases, declining performance. Do not stop here.

**Level 2 — Patterns.** What has been happening repeatedly over time? Trends, cycles, oscillations, acceleration, deterioration, recurrence. If you have no time-series view, say so — it is a material gap.

**Level 3 — Structures.** What could generate those patterns? Processes, org structure, information flows, technology, rules, incentives, dependencies, decision rights, governance, resource allocation, architecture, market structure.

**Level 4 — Mental models.** What beliefs sustain those structures? Examples: "more control improves performance", "customers mainly care about price", "employees resist change", "more technology means more productivity", "efficiency should always be maximized". For each important assumption ask: what evidence supports it, what would invalidate it, what alternative model explains the same observation?

**Level 5 — Hidden system.** Search explicitly for invisible forces: informal power, trust, fear, reputation, politics, cultural norms, shadow processes, undocumented dependencies, technical debt, historical decisions, tacit knowledge, information asymmetry, unspoken incentives, latent demand, capability erosion, accumulated fatigue.

---

## Phase 3 — Stocks and flows

Determine what accumulates or depletes over time. Candidates: workforce capability, trust, cash, inventory, technical debt, reputation, customer base, knowledge, organizational energy, fatigue, infrastructure capacity, regulatory goodwill, attention.

For each stock, identify inflows and outflows:

```
Inflows → [ STOCK ] → Outflows
Hiring  → [ Workforce ] → Attrition
```

**Never confuse a flow with a stock.** Hiring is not workforce capability. Training activity is not accumulated capability. Customer acquisition is not customer base. Deploys are not reliability. Most failed interventions raise a flow and declare victory while the stock stays flat or keeps draining.

Note for each stock: current level (or best estimate), whether it is filling or draining, how fast, and whether anyone is measuring it. Unmeasured stocks are where damage hides.

---

## Phase 4 — Model actors as adaptive agents

For every relevant actor — leaders, employees, customers, suppliers, regulators, competitors, investors, automated systems, AI agents, communities:

```
Actor:
Current state:
Desired state:
Perceived gap:
Goals:
Incentives:
Constraints:
Information available:
Decision authority:
Actions available:
Likely reaction to the intervention:
```

Then ask: how does this actor react when the intervention changes its perceived state? Actors are never passive components. An intervention that assumes compliance is an intervention with an unmodelled loop.

---

## Phase 5 — Goal conflicts

Different actors push the same system toward incompatible states:

```
Actor A goal → corrective action → system changes →
creates gap for Actor B → B's corrective action → system changes again
```

Ask: when we move the system toward our goal, whose system state moves away from theirs? This is the largest single source of policy resistance.

---

## Phase 6 — Causal structure

Basic notation:

```
A → (+) B     A increases B, all else equal
A → (−) B     A decreases B, all else equal
```

Do not stop at signs. Represent conditionality and shape:

```
A → (+ nonlinear) B
A → B until saturation
A → B after threshold T
A × C → B                      (interaction)
A → [delay] → B
A → B only if C > threshold
A → (+ initially, − later) B
```

For every major link, record: causal or correlational; confidence; delay; nonlinear behaviour; the conditions under which it holds.

---

## Phase 7 — Feedback loops

**Reinforcing (R)** — a change amplifies itself:

```
R1: Quality → (+) Adoption → (+) Revenue → (+) Investment → (+) Quality
```

**Balancing (B)** — a change triggers counteracting forces:

```
B1: Customers → (+) Workload → (+) Delay → (−) Satisfaction → (+) Future customers
```

For every recommendation, name at minimum: the reinforcing mechanisms it strengthens or weakens, the balancing mechanisms that will push back, and the loop that feeds back into the decision-maker's own perception. That last one determines whether the organization learns or oscillates.

State which loop currently dominates and under what conditions dominance could shift — systems change behaviour when one loop overtakes another, not when a parameter moves slightly.

---

## Phase 8 — Delays

Search systematically:

```
Hiring        → [months]        → productivity
Training      → [months]        → capability
Cost cutting  → [months/years]  → technical debt
Poor experience → [delay]       → churn
Burnout       → [delay]         → turnover
```

Two questions decide most of the risk:

- Could the system appear to improve before deteriorating?
- Could the system appear unchanged while an important stock accumulates or drains?

Where measurement lags reality, the decision-maker is steering on stale information — which is itself a loop worth drawing.

---

## Phase 9 — Nonlinear behaviour

For each important relationship, test:

- **Thresholds** — little happens until a critical value is crossed.
- **Saturation** — additional input stops producing benefit.
- **Tipping points** — a small change triggers a large transition.
- **Interaction effects** — A's effect depends on B.
- **Path dependence** — history shapes the current response.
- **Hysteresis** — reversing the intervention does not restore the original state.
- **Regime change** — the system starts obeying different rules.

Then ask: what happens at 10% of the intervention? At 2×? At 10×? Do not extrapolate linearly without justification.

---

## Phase 10 — Challenge causality

For each important causal claim: does A actually cause B? Could B cause A? Could C cause both? Is the relationship conditional? Could feedback make causality circular?

Classify each: established / strongly supported / plausible hypothesis / uncertain / unknown. Carry these labels into the report — an unlabelled causal claim will be read as established.

---

## Phase 11 — Policy resistance

For every intervention:

- What mechanisms will oppose it?
- Which actor will try to restore its preferred state?
- Which balancing loop activates?
- Where might the behaviour migrate rather than disappear?
- Which metric can be gamed, and how cheaply?
- Could the intervention recreate the original problem by another route?
- Could short-term improvement generate long-term deterioration?

Draw the resistance loop explicitly. A recommendation without one is incomplete.

---

## Phase 12 — Effects, not side effects

Trace recursively:

```
Decision → Effect 1 → Effect 2 → Actor response → Effect 3 → Feedback → New system state
```

Continue until effects become negligible, feedback closes the loop, or uncertainty is too high to continue — and say which of the three stopped you.

For each significant effect: who benefits, who absorbs the cost, which stock changes, which behaviour changes, which future decision it influences.

---

## Phase 13 — Emergence

Ask whether system-level behaviour could arise with no actor intending it: traffic congestion, bureaucratic accretion, market bubbles, polarization, technical fragility, coordination failure, innovation slowdown.

Undesirable outcomes do not require a bad actor or a bad decision. They frequently emerge from locally rational behaviour. If the analysis has identified a villain, check this phase before believing it.

---

## Phase 14 — Competing explanations

Never rely on a single explanation for an important phenomenon. Generate at least three:

```
Observed: productivity declined.
H1: tools are inadequate.
H2: coordination overhead increased.
H3: incentives changed behaviour.
H4: accumulated fatigue crossed a threshold.
```

For each, state what evidence would distinguish it from the others, and whether that evidence is currently available, obtainable, or out of reach.

---

## Phase 15 — Counterfactuals

- What happens if we do nothing? (Always answer this one — it is the real baseline.)
- What if we do the opposite?
- What if the central assumption is false?
- What if another actor reacts aggressively?
- What if the intervention works twice as well as expected?
- What if it works initially, then fails?
- What if the environment shifts underneath it?

---

## Phase 16 — Constraints

Find the true limiting factor: capacity, capital, skills, attention, time, trust, data, infrastructure, coordination, regulation.

Distinguish the **visible bottleneck** from the **system constraint**. Do not optimize a component that does not constrain the system — the gain is absorbed elsewhere and the effort is spent.

---

## Phase 17 — Leverage points

| Leverage | Interventions |
|---|---|
| Low | Adjusting parameters, adding resources, fixing individual events |
| Medium | Changing flows, information access, incentives, rules, processes, feedback timing |
| High | Changing system goals, decision rights, structure, mental models, capacity to learn and self-organize |

Prefer structure over repeated symptom treatment. Temper this with feasibility: a medium-leverage change that will actually be authorized and sustained beats a high-leverage one that will be blocked. When you recommend the lower-leverage option for that reason, say so explicitly and name what would have to change to make the higher one possible.

---

## Phase 18 — Robustness

Evaluate each candidate:

| Dimension | Analysis |
|---|---|
| Immediate effect | |
| Long-term effect | |
| Feedback created | |
| Stocks affected | |
| Actor responses | |
| Policy resistance | |
| Delays | |
| Nonlinear risks | |
| Tipping points | |
| Reversibility | |
| Cost of failure | |
| Hidden dependencies | |
| Uncertainty | |
| Adaptability | |
| Learning value | |

Prefer decisions robust across several futures over decisions optimized for one predicted future. Where uncertainty is high, prefer interventions that generate information early and can be reversed cheaply.

---

## Phase 19 — Model blind spots

Before recommending, ask: **what would need to be outside our current model for this decision to fail?**

Then search specifically for omitted actors, hidden incentives, missing stocks, undocumented dependencies, missing feedback loops, incorrect causal assumptions, delayed consequences, threshold effects, historical conditions, institutional constraints.

If a plausible blind spot materially changes the recommendation, revise the model rather than footnoting it.

---

## Phase 20 — Produce the system map

Provide a compact causal representation and label loops separately. See `patterns.md` for notation and a worked example. Keep the map small enough to read — 6 to 12 nodes usually carries the argument; anything larger should be split into named subsystems.
