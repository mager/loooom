---
name: blog-seo
description: Audit and fix SEO frontmatter for magerblog (Astro) posts. Use when asked to audit posts for missing keywords, weak descriptions, empty heroImages, or bad title format. Also use for running spec compliance evals (field presence + format) and quality evals (LLM-as-judge scoring of descriptions and titles). Triggers on phrases like "seo audit", "fix my blog seo", "audit posts", "check frontmatter", "rate my descriptions", "run evals on posts".
author: mager
version: 1.0.0
---

# Blog SEO Skill

Audits and repairs SEO frontmatter across magerblog posts. Runs both kinds of evals: spec compliance and quality scoring.

**Blog repo:** `~/Code/magerblog/src/content/blog/`
**Title format:** `<Tool/Topic>: <Punchy Headline>` — e.g. "Claude Code: My Free Japanese Sensei"
**Frontmatter schema:** See [references/magerblog-schema.md](references/magerblog-schema.md)
**Quality rubric:** See [references/quality-rubric.md](references/quality-rubric.md)

---

## Workflows

### 1. Full Audit (spec compliance)

Run the audit script to find all issues across posts:

```bash
bash ~/.claude/skills/blog-seo/scripts/audit.sh ~/Code/magerblog/src/content/blog/
```

Output groups issues by type: missing fields, empty fields, weak descriptions, title format violations.

### 2. Fix Issues

After audit, fix issues in batches:
- **Missing/empty `keyword`** — infer from post title + content, write as a 3-5 word search phrase
- **Missing/empty `heroImage`** — set to `""` and note an image prompt based on the post topic
- **Missing `tags`** — infer from content, use Title Case, 3-6 tags
- **Weak description** — rewrite: 1-2 punchy sentences, includes primary keyword, under 160 chars, no fluff
- **Bad title format** — reformat to `<Tool>: <Headline>` pattern

Always `npm run build` in the blog repo after edits to confirm no Astro errors.

### 3. Quality Eval (LLM-as-judge)

For individual posts or a batch, score descriptions and titles using the rubric in [references/quality-rubric.md](references/quality-rubric.md).

Score each on: **Clarity** (1-5), **Keyword density** (1-5), **Click appeal** (1-5).
Output a table: `post | description score | title score | top suggestion`.

### 4. Suggest Hero Image Prompts

For posts with `heroImage: ""`, generate an image generation prompt based on the post's topic and tone. Format:

```
POST: <slug>
PROMPT: <descriptive image generation prompt, dark terminal aesthetic, avoid generic stock photo vibes>
```

---

## Commit Convention

```bash
chore(blog): patch SEO frontmatter — keywords, descriptions, heroImages
```

## After Fixing

Commit + push. Vercel auto-deploys on push to main.
