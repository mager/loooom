# Common Blog SEO Frontmatter Schema

Universal SEO field reference for markdown-based blogs. Covers Astro, Hugo, Jekyll, Next.js MDX, and plain markdown.

---

## Core Fields (Required)

| Field | Platform Aliases | Type | Rules |
|---|---|---|---|
| `title` | — | string | Clear, specific — `<Topic>: <Punchy Headline>` pattern recommended |
| `description` | `summary`, `excerpt` | string | 50–160 chars, includes primary keyword, click-worthy |
| `pubDate` | `date`, `publishedAt` | string | ISO date: `"YYYY-MM-DD"` |

## Strongly Recommended Fields

| Field | Platform Aliases | Type | Notes |
|---|---|---|---|
| `keyword` | `keywords` | string / array | 3–6 word search phrase, lowercase |
| `tags` | `categories` | array | 3–6 values, Title Case |
| `heroImage` | `image`, `cover`, `thumbnail` | string | Full URL or `""` if pending |
| `draft` | `published` | boolean | `true`/`false = hidden`; omit = published |

---

## Title Format

The `<Topic>: <Punchy Headline>` pattern works across all blog types. A strong title has:
- **Specificity** — names the tool, framework, or concept clearly
- **A hook** — makes the reader feel something (curiosity, urgency, FOMO)
- **An audience signal** — clearly for builders, travelers, cooks, etc.

**Examples:**
- ✅ `"Astro: The Static Site Generator That Finally Gets It Right"`
- ✅ `"LangGraph: Build Stateful Multi-Agent Systems That Don't Crash"`
- ✅ `"Ghost: SEO Without the Plugin Tax"`
- ❌ `"My Blog Setup"` — no tool, no hook
- ❌ `"Building Things With Code"` — says nothing

---

## Description Rules

- **Length:** 50–160 characters (Google's snippet window)
- **Must include** the primary keyword naturally
- **Tone:** specific, results-driven — what does the reader get?
- **No filler:** avoid "In this post I will..." or "A guide to..."

**Examples:**
- ❌ `"I wrote about my new setup."` — too short, zero keywords
- ✅ `"Stop shipping AI features blind. Everything you need to unit test prompts — from five-minute quick starts to full CI/CD eval pipelines."`
- ✅ `"Ghost's native SEO fields are underrated. Here's how to fill them correctly and skip the plugin overhead entirely."`

---

## Keyword Rules

- 3–6 words, lowercase, space-separated (not comma-separated)
- Reflects what someone would actually search to find this post
- **Examples:** `"astro blog seo frontmatter"`, `"langraph multi-agent tutorial"`, `"claude code skill eval"`

---

## Platform-Specific Notes

### Astro
Defined in `src/content/config.ts` as a Zod schema. Use `z.string().optional()` for recommended fields.
```yaml
---
title: "Astro: The Static Site Generator That Finally Gets It Right"
pubDate: "2026-03-14"
description: "Astro's island architecture and content collections make it the best choice for content-heavy sites in 2026."
category: "tech"
tags: ["Astro", "Static Sites", "Web Dev"]
keyword: "astro content collections tutorial"
heroImage: "https://example.com/image.jpg"
draft: false
---
```

### Hugo
```yaml
---
title: "Hugo: Fast Builds, Zero Client JS"
date: "2026-03-14"
description: "Hugo generates 1000 pages in under a second. Here's the config that makes it work for serious content sites."
tags: ["Hugo", "Static Sites", "Performance"]
keywords: ["hugo static site generator", "hugo config"]
cover: "https://example.com/image.jpg"
draft: false
---
```

### Jekyll
```yaml
---
layout: post
title: "Jekyll: The Reliable Classic That's Not Going Anywhere"
date: 2026-03-14
description: "Jekyll's been around 15 years for a reason. Here's the plugin stack that makes it competitive in 2026."
tags: [Jekyll, Static Sites, Ruby]
image: /assets/img/jekyll.jpg
---
```

### Next.js MDX
```yaml
---
title: "Next.js MDX: Write Posts Like a Developer, Render Like a Pro"
date: "2026-03-14"
description: "MDX in Next.js App Router with custom components, syntax highlighting, and a reading time estimator."
keywords: ["next.js mdx blog", "app router mdx"]
tags: ["Next.js", "MDX", "React"]
image: "https://example.com/image.jpg"
draft: false
---
```

---

## Validation Checklist

Before publishing any post:
- [ ] Title follows `<Topic>: <Punchy Headline>` or is clearly specific + hooked
- [ ] Description is 50–160 chars and includes the primary keyword
- [ ] `keyword` / `keywords` field is set (3–6 words)
- [ ] `tags` has 3–6 values
- [ ] `heroImage` / `image` is set or `""` with an image prompt noted
- [ ] `draft` is `false` or omitted
