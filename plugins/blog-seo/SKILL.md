---
name: blog-seo
description: Audit and fix SEO metadata for any blog or site. Works with Astro, Hugo, Jekyll, Next.js MDX, Ghost, or plain markdown. Use when asked to audit posts for missing keywords, weak descriptions, missing hero images, or bad title format. Also use for running spec compliance evals (field presence + format) and quality evals (LLM-as-judge scoring of descriptions and titles). Triggers on phrases like "seo audit", "audit my blog", "fix my seo", "audit posts", "check frontmatter", "rate my descriptions", "run evals on posts", "improve my titles", "check my meta tags".
author: mager
version: 2.0.0
---

# Blog SEO Skill

Audits and repairs SEO metadata across any blog or content site. Works with frontmatter-based markdown (Astro, Hugo, Jekyll, Next.js MDX) and headless CMS exports. Runs two kinds of evals: spec compliance and quality scoring.

---

## Setup: Detect Your Platform

Before running, identify the blog directory and frontmatter fields in use:

```bash
# Find your content directory
ls src/content/blog/      # Astro
ls content/posts/         # Hugo / Jekyll
ls posts/                 # Next.js MDX
```

Then run the audit against that path:

```bash
bash ~/.claude/skills/blog-seo/scripts/audit.sh <path-to-blog-dir>
```

The script auto-detects common field names across platforms. If your schema uses non-standard field names (e.g. `summary` instead of `description`), tell the agent and it will adapt.

---

## Universal SEO Fields

Regardless of platform, these fields drive search and social performance. See [references/common-seo-schema.md](references/common-seo-schema.md) for full spec.

| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | Clear, specific, includes primary topic |
| `description` | ✅ | 50–160 chars, includes keyword, click-worthy |
| `pubDate` / `date` | ✅ | ISO format: YYYY-MM-DD |
| `keyword` / `keywords` | Strongly recommended | 3–6 word search phrase |
| `tags` / `categories` | Strongly recommended | 3–6 values |
| `heroImage` / `image` / `cover` | Strongly recommended | URL or empty string |
| `draft` | Optional | true = hidden |

---

## Workflows

### 1. Full Audit (spec compliance)

```bash
bash ~/.claude/skills/blog-seo/scripts/audit.sh <path-to-blog-dir>
```

Groups issues by type: missing fields, empty fields, short descriptions, title format problems.

### 2. Fix Issues

After audit, fix in batches:
- **Missing/empty `keyword`** — infer from post title + content, write as a 3–6 word search phrase
- **Missing/empty `heroImage`** — set to `""` and generate an image prompt (see Workflow 4)
- **Missing `tags`** — infer from content, use Title Case, 3–6 tags
- **Weak description** — rewrite: 1–2 punchy sentences, includes primary keyword, under 160 chars, no filler
- **Bad title** — reformat to `<Topic>: <Punchy Headline>` pattern

Always build/preview the site after edits to confirm no errors:
```bash
npm run build   # Astro / Next.js
hugo            # Hugo
bundle exec jekyll build  # Jekyll
```

### 3. Quality Eval (LLM-as-judge)

Score descriptions and titles using [references/quality-rubric.md](references/quality-rubric.md).

Score each on: **Clarity** (1–5), **Keyword density** (1–5), **Click appeal** (1–5).
Output a table: `post | description score | title score | top suggestion`.

Passing thresholds: description ≥ 3.5, title ≥ 4.0. Both below 3.0 = "SEO debt" — fix before promoting.

### 4. Suggest Hero Image Prompts

For posts with missing or empty hero images, generate an image generation prompt:

```
POST: <slug>
PROMPT: <descriptive image prompt — specific to post topic, avoid generic stock photo vibes>
```

### 5. Spot-Check Single Post

For a single post or URL, extract meta tags and score inline:
- Pull `<title>`, `<meta name="description">`, `<meta property="og:*">` from rendered HTML
- Score against the rubric
- Suggest specific rewrites

---

## Platform Notes

**Astro** — frontmatter defined in `src/content/config.ts`. Check `z.string()` fields.  
**Hugo** — uses `title`, `date`, `description`, `tags`, `categories`, `cover`.  
**Jekyll** — uses `title`, `date`, `description`, `tags`, `image`.  
**Next.js MDX** — depends on your schema; commonly `title`, `date`, `description`, `keywords`, `image`.  
**Ghost** — has built-in SEO fields; use the Admin API or exported JSON to audit at scale.

---

## Commit Convention

```bash
chore(blog): patch SEO frontmatter — keywords, descriptions, heroImages
```

## After Fixing

Commit + push. Most platforms (Vercel, Netlify, GitHub Pages) auto-deploy on push to main.
