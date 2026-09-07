# Patterns, Notation, and a Worked Example

## Causal notation

```
A → (+) B                  A increases B, all else equal
A → (−) B                  A decreases B, all else equal
A → [3mo] → B              delayed effect
A → (+ nonlinear) B        strength varies with system state
A → B after threshold T    no effect until T is crossed
A → B until saturation     effect flattens beyond a point
A × C → B                  interaction: A's effect depends on C
A → (+ initially, − later) B   sign reverses over time
R1, R2…                    reinforcing loops
B1, B2…                    balancing loops
```

Mark confidence where it matters: `A → (+, plausible) B` reads very differently from `A → (+, established) B`, and readers will assume the latter unless told.

## Map format

Keep maps to 6–12 nodes. Split larger models into named subsystems rather than drawing one unreadable diagram. ASCII travels everywhere; Mermaid is fine where the runtime renders it.

```
   Customer demand
         │ +
         ▼
      Workload ──────────────┐
         │ +                 │ +
         ▼                   ▼
  Employee fatigue      Service delay
         │ nonlinear         │ −
         ▼                   ▼
  Service quality ──(+)─→ Satisfaction ──(+)─→ Future demand
```

Then list the loops separately, because a diagram alone rarely makes them visible:

```
R1 — Growth
Quality → Satisfaction → Demand → Revenue → Investment → Quality

B1 — Capacity
Demand → Workload → Delay → Dissatisfaction → Reduced demand

R2 — Burnout trap
Workload → Fatigue → Productivity loss → More workload → Fatigue
```

## Common archetypes worth checking for

Recognizing one early saves a great deal of analysis. Check whether the situation matches any of these before building from scratch.

- **Fixes that fail** — a fix relieves the symptom and quietly worsens the underlying cause, so the symptom returns larger. Signature: the same problem recurring at increasing intervals of severity.
- **Shifting the burden** — a symptomatic fix is easier than the fundamental one, so capability for the fundamental solution atrophies. Signature: growing dependence on the workaround.
- **Limits to growth** — a reinforcing loop runs into a balancing constraint. Signature: growth that flattens despite unchanged effort. Pushing harder on the reinforcing loop rarely helps; the constraint is the lever.
- **Tragedy of the commons** — individually rational use depletes a shared stock. Signature: everyone acting reasonably, aggregate outcome degrading.
- **Escalation** — each actor's corrective action creates a gap for the other. Signature: spiralling investment on both sides with no change in relative position.
- **Success to the successful** — early advantage attracts resources, compounding the gap regardless of underlying merit.
- **Eroding goals** — under pressure, the target drifts toward current performance instead of performance rising to the target. Signature: standards quietly renegotiated.
- **Growth and underinvestment** — capacity investment lags demand because the need only becomes visible after service has already degraded.

## Nonlinearity checklist

For each important relationship, ask which of these applies: threshold, saturation, tipping point, interaction, path dependence, hysteresis, regime change. Then test 10%, 2×, and 10× of the intervention. If the answer is the same shape at all three, either the relationship is genuinely linear over that range or it hasn't been examined.

## Actor template

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

The two lines that predict the most: *incentives* and *information available*. Actors respond to the system they can see, not the one you modelled.

## Stock and flow discipline

| This is a flow | This is not the stock |
|---|---|
| Hiring rate | Workforce capability |
| Training hours delivered | Accumulated capability |
| Customer acquisition | Customer base |
| Features shipped | Product value |
| Deploys per week | Reliability |
| Cost reduction actions | Technical debt |
| Meetings held | Alignment |
| Documents written | Shared understanding |

Interventions almost always act on flows. Outcomes almost always depend on stocks. The gap between them is where delays live, and it is the most common reason a metric improves while the situation does not.

---

## Worked micro-example

**Event.** A delivery team's throughput has fallen for three quarters. Leadership proposes adding four engineers.

**Pattern.** Throughput rose after each of the last two headcount increases, then fell below the prior baseline within two quarters.

**Structure.** Onboarding is absorbed by the same senior engineers who do the complex work. Review capacity is concentrated in three people. Delivery pressure has kept refactoring perpetually deprioritized.

**Mental model.** "Throughput scales with headcount." The pattern above is direct evidence against it, which is what makes the assumption worth naming.

**Stocks.** Technical debt (filling — inflow from deadline-driven shortcuts, outflow near zero). Senior attention (draining — outflow to onboarding and review). Shared system knowledge (flat despite hiring, because it accrues through review participation, which is bottlenecked).

**Actors.** Senior engineers: want to ship and to mentor, cannot do both; will protect delivery commitments by cutting review depth. Managers: measured on throughput, so they read the dip as a capacity problem. New hires: want to contribute early, will avoid the unfamiliar debt-heavy modules.

**Loops.**

```
B1 — Onboarding drag
Headcount → [6–10 wks] → Senior attention diverted → Throughput ↓

R1 — Debt spiral
Delivery pressure → Shortcuts → Technical debt → Time per change ↑ → More pressure

R2 — Knowledge dilution
More engineers → Review load per reviewer ↑ → Review depth ↓ →
Knowledge transfer ↓ → Defects ↑ → Senior time on defects ↑ → Review depth ↓
```

**Delays.** Onboarding cost is immediate; contribution arrives in months. Debt accumulates invisibly until change cost crosses a threshold. This is why each hiring round looks successful for one quarter.

**Nonlinearity.** Review capacity saturates: past roughly one reviewer per five active contributors, added engineers reduce net output rather than increasing it. The team may already be past that point, which would make the proposed intervention actively harmful rather than merely ineffective.

**Policy resistance.** If throughput becomes the tracked metric, work will be split into smaller units and reported as more tickets, restoring the number without restoring output.

**Competing hypotheses.** (H1) capacity shortage; (H2) review bottleneck; (H3) debt-driven cost per change; (H4) fatigue past a threshold. Distinguishing evidence: cycle-time breakdown by stage (isolates H2), change-cost trend in high-debt modules (H3), and attrition and absence trend (H4). All three are obtainable from existing data within a week, which makes committing to headcount before looking hard to justify.

**Leverage.** Adding people is low leverage and, given saturation, possibly negative. Medium leverage: distribute review capacity, and change what the team's goal is measured against — from ticket throughput to cost-per-change. High leverage: fund debt reduction as scheduled work, which changes the structure generating R1 rather than compensating for it.

**Blind spot check.** If the real constraint is a dependency on another team's release process, all of the above is optimizing a non-constraint. Verify before committing — one question to the team surfaces it.

**Confidence.** Moderate. The loops are well supported by the recurrence pattern; the saturation threshold is estimated, not measured; the external-dependency hypothesis is untested. Recommendation: run the three diagnostics for one week before authorizing headcount, since hiring is slow to reverse and the diagnostics are cheap.
