# loooom

The plugin catalog for [loooom.xyz](https://loooom.xyz) — quality-scored Claude Code plugins.

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
| `npx loooom help` | Show help |

## Requirements

- Node.js 18+

## License

MIT
