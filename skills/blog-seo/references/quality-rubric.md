# Quality Eval Rubric (LLM-as-Judge)

Use this rubric to score blog post descriptions and titles. Apply it per-post and output a summary table.

---

## Description Scoring (1–5 per dimension)

### Clarity (1–5)
Does the reader know exactly what they'll get?
- 5: Specific outcome stated, zero ambiguity
- 3: Somewhat clear, but vague on what's inside
- 1: Could describe any article ever written

### Keyword Density (1–5)
Does the description contain the post's primary keyword naturally?
- 5: Primary keyword present, reads naturally
- 3: Related words present but not the exact keyword
- 1: No relevant keywords at all

### Click Appeal (1–5)
Would someone in a search result click this?
- 5: Creates urgency, curiosity, or clear value — must read
- 3: Fine, but forgettable
- 1: No reason to click over any other result

**Description score = average of 3 dimensions (out of 5)**

---

## Title Scoring (1–5 per dimension)

### Format Compliance (1–5)
Does it follow `<Tool>: <Hot Headline>`?
- 5: Perfect pattern, tool clearly named
- 3: Has a colon but weak headline or vague tool
- 1: No colon, generic phrase, or missing tool name

### Hook Strength (1–5)
Does the headline after the colon create desire to read?
- 5: Specific, bold, results-driven — "Build Stateful Multi-Agent Systems That Don't Crash"
- 3: Descriptive but not exciting — "A Guide to LangGraph"
- 1: Factual but flat — "Using Go and Firestore"

### Audience Clarity (1–5)
Is it obvious who this is for?
- 5: Developer/builder audience crystal clear
- 3: Could be for anyone
- 1: Completely unclear

**Title score = average of 3 dimensions (out of 5)**

---

## Output Format

After scoring a batch, output a markdown table:

```
| Post | Desc Score | Title Score | Top Fix |
|---|---|---|---|
| claude-code-eval-loop | 4.0 | 4.3 | Description needs primary keyword |
| hello-world | 1.7 | 1.0 | Rewrite title + description from scratch |
```

Then list the **bottom 3 posts** with specific rewrite suggestions.

---

## Passing Thresholds

- **Description ≥ 3.5** — acceptable
- **Title ≥ 4.0** — acceptable
- **Both < 3.0** — high priority fix

Posts with both description AND title below 3.0 are "SEO debt" — fix before promoting on social.
