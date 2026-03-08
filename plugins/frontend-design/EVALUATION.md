# Evaluations for frontend-design

This plugin uses a **dual evaluation strategy** combining promptfoo for quality testing and Anthropic-style trigger evals for routing precision.

## Quick Start

```bash
# Quality evals (promptfoo)
npx promptfoo@latest eval --config promptfooconfig.yaml

# Trigger evals (requires skill-creator scripts)
python /path/to/skill-creator/scripts/run_eval.py \
  --eval-set agents/eval-set.json \
  --skill-path ./skills/frontend-design \
  --runs-per-query 3
```

## Evaluation Types

### 1. Quality Evals (promptfoo)

Tests whether the skill produces high-quality output *given that it's active*.

- **Tool**: promptfoo with `llm-rubric` assertions
- **Config**: `promptfooconfig.yaml`
- **Tests**: 8 scenarios covering button design, cards, typography, dark mode, etc.

```yaml
assert:
  - type: llm-rubric
    value: "Gives specific, opinionated CSS or design direction..."
```

### 2. Trigger Evals (Anthropic-style)

Tests whether Claude *activates* the skill on the right queries.

- **Tool**: `run_eval.py` from skill-creator
- **Config**: `agents/eval-set.json`
- **Dataset**: 24 queries (16 positive, 8 negative)

Each query runs through Claude Code multiple times. The evaluator checks if Claude invokes the skill (via `Skill` or `Read` tool calls).

## The Eval-Set Format

```json
[
  {
    "query": "Design a card component for a music app",
    "should_trigger": true,
    "note": "core use case — UI component design"
  },
  {
    "query": "Help me write a Node.js REST API",
    "should_trigger": false,
    "note": "backend — no design intent"
  }
]
```

## Description Optimization

The skill description is the primary trigger signal. Current optimized version:

> "Use this skill for frontend UI design tasks — designing or reviewing components (buttons, cards, forms, navbars, modals), specifying CSS with concrete values, layout and spacing decisions, typography selection, color systems, dark mode, and visual polish. Triggers on 'design a [component]', 'how should I style...', 'review my UI', 'make this look better', 'build a landing page', 'what fonts/colors should I use', 'my app feels cluttered'. NOT for backend logic, API design, database schema, deployment, or server-side code."

### Key Principles

1. **Imperative voice** — "Use this skill for..." not "This skill does..."
2. **Concrete examples** — List component types, not abstract philosophy
3. **Trigger phrases** — Include exact patterns users type
4. **Negative space** — Explicitly say what NOT to trigger on

## Running the Optimization Loop

To automatically improve the description:

```bash
python /path/to/skill-creator/scripts/run_loop.py \
  --eval-set agents/eval-set.json \
  --skill-path ./skills/frontend-design \
  --max-iterations 5 \
  --holdout 0.4 \
  --verbose
```

This runs eval → improve description → repeat until all pass or max iterations.

## CI Integration

Quality evals run on every PR via GitHub Actions. Trigger evals run manually before releases.

## Adding New Tests

### Quality Tests (promptfoo)

Add to `promptfooconfig.yaml`:

```yaml
- description: "Your new test"
  vars:
    message: "Test query here"
  assert:
    - type: llm-rubric
      value: "Specific criteria for passing"
```

### Trigger Tests (eval-set)

Add to `agents/eval-set.json`:

```json
{
  "query": "Your test query",
  "should_trigger": true,
  "note": "Why this should/shouldn't trigger"
}
```

## Philosophy

- **Quality evals** ensure consistency and opinionated output
- **Trigger evals** ensure the right skill fires at the right time
- **Both together** = a reliable, trustworthy skill

The eval set is documentation. It defines the skill's contract with users.
