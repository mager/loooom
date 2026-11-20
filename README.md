# loooom

A small, **curated** collection of high-quality skills — and an experiment in measuring what makes a skill good.

Most "skills" in the wild are a generic paragraph with a nice filename; you could regenerate them from the title alone. Loooom is the opposite bet: a tight set of skills held to a deliberately high bar, each **scored against a rubric** so quality is visible instead of vibes. The web app lives at [loooom.xyz](https://loooom.xyz); this is the main repo.

More on the why: [Loooom: Curated Skills for People Who Don't Code](https://mager.co/blog/2026-06-02-loooom/).

## Skills gym

The gym release (`0.3.0`) is not on npm yet. To try the tested source version now, use Node 22+ and a signed-in Codex CLI:

```sh
npx --yes https://github.com/mager/loooom/archive/f45997f86ced5d8db2020ab74b9e761fc1f30a39.tar.gz gym climb focus-climb --rounds 3 --repetitions 3
```

The shorter npm commands below apply after version `0.3.0` is published.


## Train a skill

Use Node 22+ and a signed-in Codex CLI:

```sh
npx loooom@latest gym climb focus-climb --rounds 3 --repetitions 3
npx loooom@latest gym climb absorb-climb
```

The gym has two strategies: repair a failure, or shorten a skill. It saves every candidate, response, and decision. Search uses training cases only. Final verification uses fresh responses and held-out cases after the candidate is locked.

Open the JSON report at [loooom.xyz/gym](https://loooom.xyz/gym). Files stay in your browser. Read the [runner guide](gym/README.md) or import the engine in your own tool:

```js
import { hillClimb, evaluateSkill, createCodexAdapter } from 'loooom/gym';
```

The [library guide](gym/LIBRARY.md) covers adapters, storage, cancellation, budgets, and the evidence needed before promotion. The engine stays inside Loooom, with a public boundary for a future standalone package.

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
| `npx loooom gym climb <suite>` | Search, select, and verify a skill |
| `npx loooom gym run <suite>` | Run a one-pass repair or ablation |
| `npx loooom help` | Show help |

## Requirements

- Node.js 22+

## License

MIT
