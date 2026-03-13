# magerblog Frontmatter Schema

Astro content collection schema. Every blog post **must** have all required fields.

## Required Fields

| Field | Type | Rules |
|---|---|---|
| `title` | string | Format: `<Tool/Topic>: <Punchy Headline>` |
| `pubDate` | string | ISO date: `"YYYY-MM-DD"` |
| `description` | string | 1-2 sentences, 50-160 chars, includes primary keyword |
| `category` | string | One of: `code`, `tech`, `cooking`, `life` |

## Strongly Recommended Fields

| Field | Type | Notes |
|---|---|---|
| `keyword` | string | 3-6 word search phrase, lowercase, no quotes |
| `heroImage` | string | Google Photos URL (`lh3.googleusercontent.com`) or `""` if pending |
| `tags` | array | 3-6 strings, Title Case |
| `draft` | boolean | `true` = hidden; omit or `false` = published |

## Title Format Rules

- Pattern: `<Tool or Topic>: <Hot Headline>`
- Examples:
  - ✅ `"Claude Code: My Free Japanese Sensei"`
  - ✅ `"brainpack: Move Your AI Agent's Brain in 60 Seconds"`
  - ✅ `"LangGraph: Build Stateful Multi-Agent Systems That Don't Crash"`
  - ❌ `"Hello World"` — no tool, no hook
  - ❌ `"Building a coffee API with Go Fx and Firestore"` — missing colon separator, not punchy enough

## Description Rules

- **Length:** 50-160 characters (Google's snippet window)
- **Must include** the primary keyword naturally
- **Tone:** punchy, specific — what will the reader learn or get?
- **No fluff:** avoid "In this post I will..." or "A guide to..."
- ❌ `"mager.co is back!"` — too short, zero keywords
- ✅ `"Stop shipping AI features blind. Everything you need to unit test prompts — from five-minute quick starts to full CI/CD eval pipelines."`

## Keyword Rules

- 3-6 words, lowercase, space-separated (not comma-separated)
- Reflects what someone would search for to find this post
- Examples: `"claude code skill eval testing"`, `"AI life architect agent"`, `"LangGraph multi-agent tutorial"`

## Category Values

| Value | Use For |
|---|---|
| `code` | Engineering, tools, dev tutorials |
| `tech` | AI concepts, deep dives, frameworks |
| `cooking` | Recipes |
| `life` | Travel, personal, health |

## Example Valid Frontmatter

```yaml
---
title: "Claude Code: How to Write, Eval, and Iterate on a Skill"
pubDate: "2026-03-08"
description: "Part 2 of the prompt verification series. Does your skill even fire? Here's the eval loop that catches the gap between spec compliance and real-world quality."
category: "code"
tags: ["Claude Code", "Evals", "Skills", "Testing", "AI"]
keyword: "claude code skill eval firing loop"
heroImage: "https://lh3.googleusercontent.com/..."
draft: false
---
```
