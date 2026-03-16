---
name: autoresearch
description: Apply Karpathy's autoresearch pattern to autonomously improve any measurable artifact — prompts, skills, code, configs — using a modify → measure → keep/discard loop.
author: mager
version: 1.0.0
---

# autoresearch — Autonomous Improvement Loop

Teach your agent to improve itself (or your code, prompts, configs) using the pattern open-sourced by Andrej Karpathy. The agent modifies one file, measures one metric, and keeps only what improves the score. Repeat until you wake up to a better system.

> *"You're not touching any of the Python files. Instead, you are programming the program.md Markdown files that provide context to the AI agents."* — Karpathy

---

## The Pattern (3 Constraints)

Before running any loop, define these three things:

```
FILE_TO_MODIFY = the ONE file the agent can edit
METRIC         = the ONE number that defines "better"
BUDGET         = the fixed time/compute per experiment
```

Then loop:

```
LOOP:
  1. Read current state of FILE_TO_MODIFY
  2. Form a hypothesis: "changing X might improve METRIC because Y"
  3. Make one targeted change
  4. Run evaluation (within BUDGET)
  5. Measure METRIC
  6. If improved → keep (git commit)
  7. If not → discard (git reset or revert)
  8. Log hypothesis + result
  GOTO LOOP
```

---

## Activation Triggers

Start this skill when the user says:
- "run autoresearch on X"
- "improve X autonomously / overnight / while I sleep"
- "set up the Karpathy loop for X"
- "agent loop to optimize X"
- "autoresearch pattern"

---

## Setup Protocol

**Step 1: Identify the target**

Ask the user what they want to improve:
- A skill / prompt / instruction file?
- A config file?
- A piece of code?
- A UI component?

**Step 2: Confirm the 3 constraints**

```
FILE_TO_MODIFY: [single file path]
METRIC: [what number are we optimizing? lower or higher?]
BUDGET: [how long per experiment? e.g. 30s eval, 5min build]
```

If the metric isn't obvious, help them define one. Common patterns:

| Target | Metric | Measurement |
|--------|--------|-------------|
| Claude skill / prompt | Eval score (0-100) | Run eval script |
| Lighthouse-auditable UI | Composite score | `npx lighthouse --output=json` |
| Sports prediction prompt | Backtested accuracy | Run against historical data |
| API endpoint | p95 latency | Load test (k6/wrk) |
| Classifier prompt | F1 score | Run against labeled test set |

**Step 3: Check for evaluation infrastructure**

Ask: "Do you have a script that returns the metric, or do we need to build one?"

If they have one → use it directly.  
If not → help them write a `eval.sh` or `eval.py` that:
1. Runs the artifact against a fixed test set
2. Returns a single number to stdout

---

## Running the Loop

Once the 3 constraints are confirmed and evaluation works:

### Iteration Format

For each iteration, produce:

```markdown
## Iteration N

**Hypothesis:** [What change might help and why]
**Change:** [Exact diff — what changed in FILE_TO_MODIFY]
**Evaluation:** [Running BUDGET evaluation...]
**Result:** METRIC = [X] (prev: [Y])
**Decision:** ✅ KEEP / ❌ DISCARD
**Notes:** [What this tells us]
```

### Loop Discipline

- One change per iteration. No compound changes.
- Always measure before and after.
- Log everything — even failures are signal.
- Never modify the eval script or test set mid-run.
- Stop after N iterations OR when metric plateaus for 3+ rounds.

---

## For Loooom Skill Improvement

The autoresearch pattern maps perfectly to Loooom skill files:

```
FILE_TO_MODIFY = skills/[name]/SKILL.md
METRIC         = eval score from eval-scores.json (0-100)
BUDGET         = single eval run (~30 seconds)
```

**Setup:**
```bash
cd ~/Code/loooom-catalog
cat eval-scores.json  # current baseline scores
```

**Each iteration:**
1. Make one targeted improvement to `SKILL.md` (clearer triggers, better examples, tighter constraints, improved format)
2. Run eval: `npm run eval -- skills/[name]` (or equivalent)
3. Compare score to baseline
4. Keep if score improved, revert if not
5. Log result

**Meta-skill note:** You are an agent improving agent instructions. The quality of the hypothesis matters as much as the change. Think like a researcher, not a guesser.

---

## Applying to Other Projects

### prxps (Sports Predictions)
```
FILE_TO_MODIFY = sentiment extraction prompt or scoring weights
METRIC         = prediction accuracy on historical games (%)
BUDGET         = backtest run against last 30 days of games
```

### magerblog (Performance)
```
FILE_TO_MODIFY = CSS or layout component
METRIC         = Lighthouse composite score (perf + a11y + seo)
BUDGET         = npm run build + Lighthouse audit (~60s)
```

### BeatBrain (Discovery)
```
FILE_TO_MODIFY = recommendation algorithm or scoring weights
METRIC         = diversity index or relevance score
BUDGET         = run against fixed seed set of 50 tracks
```

---

## Session End

When the run completes (N iterations or plateau), produce a summary:

```markdown
## autoresearch Run Complete

**Target:** [FILE_TO_MODIFY]
**Iterations:** [N]
**Baseline METRIC:** [X]
**Final METRIC:** [Y]
**Delta:** [+Z] improvement

### Accepted Changes (N)
- Iteration 2: [change] → +3.2 points
- Iteration 5: [change] → +1.8 points

### Rejected Changes (N)
- Iteration 1: [change] → no improvement (-0.4)
- Iteration 3: [change] → regression (-2.1)

### Recommended Next Steps
- [What to try next based on what worked]
- [What hypotheses were NOT tested yet]
```

---

## Reference

- Original repo: [github.com/karpathy/autoresearch](https://github.com/karpathy/autoresearch)
- Blog post: [mager.co/blog/autoresearch-pattern](https://mager.co/blog/autoresearch-pattern)
- Companion skill: `mager/beginner-japanese` (stateful skill pattern)
