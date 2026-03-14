# Quality Eval Rubric (LLM-as-Judge)

Use this rubric to score blog post descriptions and titles. Works for any blog or content site — Astro, Hugo, Jekyll, Next.js MDX, Ghost, or plain markdown.

Apply per-post and output a summary table.

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

### Specificity (1–5)
Does the title clearly name the topic, tool, or subject?
- 5: Instantly obvious what this is about
- 3: Vaguely on-topic but could mean multiple things
- 1: Generic — could be any article

### Hook Strength (1–5)
Does the headline create desire to read?
- 5: Bold, results-driven, specific — "Build Stateful Multi-Agent Systems That Don't Crash"
- 3: Descriptive but not exciting — "A Guide to LangGraph"
- 1: Factual but flat — "Using Go and Firestore"

### Audience Clarity (1–5)
Is it obvious who this is for?
- 5: Target reader crystal clear (developer, traveler, home cook, etc.)
- 3: Could be for anyone
- 1: Completely unclear

**Title score = average of 3 dimensions (out of 5)**

---

## Output Format

After scoring a batch, output a markdown table:

```
| Post | Desc Score | Title Score | Top Fix |
|---|---|---|---|
| astro-seo-guide | 4.0 | 4.3 | Description needs primary keyword |
| hello-world | 1.7 | 1.0 | Rewrite title + description from scratch |
| ghost-setup | 3.2 | 4.0 | Punch up description click appeal |
```

Then list the **bottom 3 posts** with specific rewrite suggestions.

---

## Passing Thresholds

- **Description ≥ 3.5** — acceptable
- **Title ≥ 4.0** — acceptable
- **Both < 3.0** — high priority fix

Posts with both description AND title below 3.0 are "SEO debt" — fix before promoting on social.

---

## Example Score Walkthrough

**Post:** "My New Blog Setup"  
**Description:** "I made a new blog."

- Clarity: 1 (no idea what's inside)
- Keyword Density: 1 (no keywords)
- Click Appeal: 1 (zero reason to click)
- **Desc score: 1.0**

- Specificity: 1 (which blog? what stack?)
- Hook: 1 (no hook)
- Audience: 1 (anyone? no one?)
- **Title score: 1.0**

→ **Verdict: SEO debt. Rewrite everything.**

---

**Post:** "Astro: Why I Migrated 200 Posts and Never Looked Back"  
**Description:** "I moved my entire blog to Astro content collections. The build time went from 45s to 3s, and I never touched a webpack config again."

- Clarity: 5 (specific outcome: migration, build time improvement)
- Keyword Density: 4 (astro content collections present)
- Click Appeal: 5 (specific numbers, relatable pain)
- **Desc score: 4.7**

- Specificity: 5 (Astro, migration topic)
- Hook: 5 ("never looked back" + implied transformation)
- Audience: 5 (clearly for devs who have legacy blogs)
- **Title score: 5.0**

→ **Verdict: Ship it.**
