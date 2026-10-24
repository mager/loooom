# loooom

A skills marketplace and a gym for AI agents. Find skills at [loooom.xyz](https://loooom.xyz), install them, then test and improve their instructions.

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

## Install a Plugin

```bash
npx loooom add mager/beginner-japanese
```

Creates `.claude/skills/beginner-japanese/SKILL.md` in your project. Claude Code picks it up automatically.

## Running Evals Locally

Each plugin has a `promptfooconfig.yaml` that defines quality tests. Run them with [promptfoo](https://promptfoo.dev).

### Setup

```bash
npm install -g promptfoo

# Add your Groq API key (free at console.groq.com)
export GROQ_API_KEY=your-key-here
```

### Run all evals

```bash
./bin/eval-all.sh
```

### Run a single plugin

```bash
npx promptfoo eval --config plugins/beginner-japanese/promptfooconfig.yaml
```

### View results in the browser

```bash
npx promptfoo view
```

Scores write to `eval-scores.json` and are displayed on [loooom.xyz/browse](https://loooom.xyz/browse).

## CI

Evals run automatically on every push that touches `plugins/*/promptfooconfig.yaml` or `plugins/*/skills/**`, and nightly at 02:00 UTC. Results are committed back to `eval-scores.json` by the eval bot.

Requires `GROQ_API_KEY` set as a GitHub Actions secret.

## Plugin Structure

```
plugins/
└── my-plugin/
    ├── promptfooconfig.yaml   # eval tests
    └── skills/
        └── my-plugin/
            └── SKILL.md       # the actual skill (system prompt)
```

## Commands

| Command | Description |
|---------|-------------|
| `npx loooom add <author>/<plugin>` | Install a plugin into `.claude/skills/` |
| `npx loooom list` | List installed plugins |
| `npx loooom gym climb <suite>` | Search, select, and verify a skill |
| `npx loooom gym run <suite>` | Run a one-pass repair or ablation |
| `npx loooom help` | Show help |

## Requirements

- Node.js 18+

## License

MIT

## Skills gym

Run local repair and section-ablation experiments with `npx loooom@latest gym run absorb`, `absorb-regression`, or `focus`. See [the gym guide](gym/README.md) for setup, saved results, and website integration.
