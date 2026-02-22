---
name: frontend-design
description: A frontend design agent channeling a specific aesthetic philosophy. Every UI should feel hot, sleek, usable, fun, and addictive.
author: mager
version: 1.0.0
---

# Frontend Design

A frontend design skill for AI agents. Every UI you touch should feel hot, sleek, sexy, usable, fun, and addictive.

## Core Philosophy

Design is not decoration. It's communication. Every pixel exists to serve the user's intent while making them *feel* something. The best interfaces are invisible — they get out of the way while being impossibly beautiful.

**Principles:**
- **Clarity over cleverness** — if it needs a tooltip, redesign it
- **Motion with meaning** — every animation tells a story
- **Contrast is king** — visual hierarchy through bold contrast, not clutter
- **White space is not empty** — it's breathing room
- **Dark mode first** — because we live in the future

## Design Patterns

### Cards
Cards are the atomic unit of modern UI. Rules:
- Subtle border, generous padding (1.25rem+)
- Hover state: slight lift (translateY -2px) + border glow
- Never more than 3 levels of text hierarchy per card
- Background should be 1-2 shades lighter than page bg

### Buttons
- Primary: solid fill, bold, slight shadow
- Secondary: outlined, transparent bg
- Ghost: no border, text only, underline on hover
- Always include hover + active + focus states
- Min touch target: 44px

### Forms
- Labels above inputs, never floating
- Generous input padding (0.875rem)
- Focus ring = accent color border, not browser default
- Error states: pink/red border + helper text below
- Success: green accent, brief animation

## Layout Principles

### Spacing Scale
Use a consistent spacing scale based on 0.25rem increments:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

### Grid
- Max content width: 1200px
- Side padding: 2rem (1rem mobile)
- Column gap: 1.5-2rem
- Mobile: single column, always

### Typography
- Display: bold, tight letter-spacing (-0.02em)
- Body: 1rem, line-height 1.6
- Small: 0.875rem for metadata
- Handwriting fonts for personality moments
- Monospace for code, versions, hashes

## Color System

Always define CSS variables. Never hardcode colors.

```css
:root {
  --bg-primary: #faf6f0;      /* warm cream */
  --bg-secondary: #f0ebe3;
  --bg-card: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #555;
  --text-muted: #999;
  --border: rgba(0,0,0,0.08);
  --accent: #e84a5f;          /* rose */
  --accent-2: #4a90e2;        /* blue */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
}
```

Dark mode: invert the bg scale, keep accent colors, increase border opacity slightly.

## Animation

- Hover transitions: 0.2-0.25s ease
- Page transitions: 0.3s ease
- Never exceed 0.5s for UI animations
- Use `transform` and `opacity` only — no animating layout properties
- `will-change: transform` on frequently animated elements

## Component Checklist

Before shipping any component, verify:
- [ ] Hover state defined
- [ ] Focus state defined (keyboard accessible)
- [ ] Active/pressed state
- [ ] Loading state (if async)
- [ ] Empty state (if data-driven)
- [ ] Error state (if can fail)
- [ ] Mobile layout (< 768px)
- [ ] Dark mode compatible

## Anti-Patterns

Never do these:
- Fixed pixel widths on text containers
- `!important` in your CSS
- Z-index > 100 (symptom of stacking context chaos)
- Color without sufficient contrast (WCAG AA minimum)
- Hover-only interactions (mobile has no hover)
- `outline: none` without a replacement focus style

## Trigger Phrases

Activate on:
- "Design a [component]"
- "Make this look better"
- "Review my UI"
- "Build a landing page"
- "How should I style [X]"
- Any request involving visual design, CSS, or component architecture
