---
name: validate-skill
description: Validate a Loooom/Agent Skills SKILL.md against the official Anthropic spec using skills-ref. Checks frontmatter structure, required fields, naming rules, and directory conventions. Use when building or publishing a new skill.
metadata:
  author: loooom
  version: "1.0.0"
---

# validate-skill

You are a skill validator. When activated, you audit a SKILL.md file (or a skill directory) against the official [Agent Skills spec](https://agentskills.io) from Anthropic.

## What the Spec Requires

A valid skill directory must contain a `SKILL.md` file with a YAML frontmatter block at the top.

**Required frontmatter fields:**
- `name` — kebab-case, lowercase, no leading/trailing hyphens, no consecutive hyphens, max 64 chars. Must exactly match the skill's directory name.
- `description` — plain text, max 1024 chars. This is what agents read to decide when to use your skill.

**Optional frontmatter fields:**
- `license` — e.g. `MIT`, `Apache-2.0`
- `compatibility` — model/platform constraints, max 500 chars
- `allowed-tools` — experimental tool access hints
- `metadata` — key-value map for anything else (author, version, tags, etc.)

**No other top-level fields are allowed.** Things like `author`, `version`, `tags` must live under `metadata:`.

### Valid Example

```markdown
---
name: my-skill
description: What this skill does and when to use it. Keep it under 1024 chars.
metadata:
  author: yourhandle
  version: "1.0.0"
  license: MIT
---

# My Skill

Instructions here...
```

### Invalid Example (will fail)

```markdown
---
name: My Skill          ← must be lowercase kebab-case
description:            ← cannot be empty
author: yourhandle      ← not a top-level field
version: 1.0.0          ← not a top-level field
---
```

---

## Validation Checklist

When a user asks you to validate a skill, go through this checklist:

### 1. File structure
- [ ] Directory exists with a `SKILL.md` (or `skill.md`) file
- [ ] File starts with `---` (YAML frontmatter)
- [ ] Frontmatter is properly closed with a second `---`

### 2. Required fields
- [ ] `name` is present and non-empty
- [ ] `description` is present and non-empty

### 3. Name rules
- [ ] All lowercase
- [ ] Only letters, digits, and hyphens
- [ ] Does not start or end with a hyphen
- [ ] No consecutive hyphens (`--`)
- [ ] Max 64 characters
- [ ] Matches the skill's directory name exactly

### 4. Description rules
- [ ] Non-empty string
- [ ] Max 1024 characters

### 5. No unexpected fields
- [ ] Only spec-allowed fields at the top level: `name`, `description`, `license`, `compatibility`, `allowed-tools`, `metadata`
- [ ] Custom fields (`author`, `version`, etc.) are under `metadata:`

### 6. Compatibility (if present)
- [ ] Max 500 characters

---

## Using the Official CLI

If the user has Python available, you can validate programmatically with [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref):

```bash
# Install (one time)
git clone --depth=1 https://github.com/agentskills/agentskills.git /tmp/agentskills
cd /tmp/agentskills/skills-ref
pip install -e .

# Validate a skill
skills-ref validate path/to/your-skill

# Read parsed properties as JSON
skills-ref read-properties path/to/your-skill

# Generate the <available_skills> XML for agent prompts
skills-ref to-prompt path/to/your-skill
```

A skill passes if `skills-ref validate` returns with exit code 0 and no error output.

---

## Common Errors and Fixes

| Error | Fix |
|---|---|
| `Unexpected fields: author, version` | Move to `metadata: { author: ..., version: ... }` |
| `Directory name 'foo' must match skill name 'foo-bar'` | Rename the directory to match `name` exactly |
| `Skill name must be lowercase` | Change `name: MySkill` → `name: my-skill` |
| `Missing required file: SKILL.md` | Create `SKILL.md` in the skill directory |
| `SKILL.md must start with YAML frontmatter` | Add `---` block at the very top |
| `Description exceeds 1024 character limit` | Shorten the description field |

---

## Adding CI Validation (GitHub Actions)

To gate all PRs on skill validity, add `.github/workflows/validate-skills.yml`:

```yaml
name: Validate Skills

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Install skills-ref
        run: |
          git clone --depth=1 https://github.com/agentskills/agentskills.git /tmp/agentskills
          cd /tmp/agentskills/skills-ref && pip install -e . -q
      - name: Validate all skills
        run: |
          FAILED=0
          for skill_dir in plugins/*/skills/*/; do
            skills-ref validate "$skill_dir" || FAILED=1
          done
          exit $FAILED
```

---

## Trigger Phrases

Activate on:
- "validate my skill"
- "does my SKILL.md pass the spec?"
- "check my skill frontmatter"
- "is this skill valid?"
- "what's wrong with my SKILL.md"
- Any request to review, audit, or publish a skill file
