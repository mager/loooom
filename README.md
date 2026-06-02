# loooom

A small, **curated** collection of high-quality skills — and an experiment in measuring what makes a skill good.

Most "skills" in the wild are a generic paragraph with a nice filename; you could regenerate them from the title alone. Loooom is the opposite bet: a tight set of skills held to a deliberately high bar, each **scored against a rubric** so quality is visible instead of vibes. The web app lives at [loooom.xyz](https://loooom.xyz); this is the main repo.

More on the why: [Loooom: Curated Skills for People Who Don't Code](https://mager.co/blog/2026-06-02-loooom/).

## Install a skill

```bash
npx loooom add mager/beginner-japanese
```

Creates `.claude/skills/beginner-japanese/SKILL.md` in your project. Claude Code picks it up automatically — and because the skills are agent-agnostic, you can copy a `SKILL.md` into any AI just as well.

## Quality scoring

Every skill is scored before it ships — that's the whole point of the project. Scoring runs on a **free** model (Groq), so grading the catalog costs nothing.

### Setup

```bash
npm install -g promptfoo

# Free key at console.groq.com
export GROQ_API_KEY=your-key-here
```

### Run

```bash
./bin/eval-all.sh                                                            # all skills
npx promptfoo eval --config plugins/beginner-japanese/promptfooconfig.yaml   # one skill
npx promptfoo view                                                           # results in the browser
```

Scores write to `eval-scores.json` and show on [loooom.xyz/browse](https://loooom.xyz/browse).

## CI

Evals run on every push that touches `plugins/*/promptfooconfig.yaml` or `plugins/*/skills/**`, and nightly at 02:00 UTC. Results are committed back to `eval-scores.json` by the eval bot. Requires `GROQ_API_KEY` set as a GitHub Actions secret.

## Structure

```
plugins/
└── my-plugin/
    ├── promptfooconfig.yaml   # quality tests
    └── skills/
        └── my-plugin/
            └── SKILL.md       # the skill itself
```

## Commands

| Command | Description |
|---------|-------------|
| `npx loooom add <author>/<plugin>` | Install a skill into `.claude/skills/` |
| `npx loooom list` | List installed skills |
| `npx loooom help` | Show help |

## Requirements

- Node.js 18+

## License

MIT
