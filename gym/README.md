# Skills gym

A small local loop: evaluate a skill, inspect failures, change the instructions, and evaluate again. The loop edits Markdown. It does not train model weights.

## Run

Use Node 22+ and a recent, signed-in [Codex CLI](https://learn.chatgpt.com/docs/non-interactive-mode). These examples use the existing ChatGPT sign-in and consume the account's Codex usage. No separate API key is required by this runner.

```sh
codex login status
node bin/loooom.js gym run absorb --model gpt-6-astra
node bin/loooom.js gym run absorb-regression --model gpt-6-astra
node bin/loooom.js gym run focus --model gpt-6-astra
npm test
```

Choose a model available to your account, or omit `--model` to use the CLI's default with user config disabled. Use one explicit model for a comparison. CLI defaults and model behavior can change; this is not deterministic replay. The recorded examples used codex-cli 0.154.0 and gpt-6-astra.

`npm run gym -- run absorb` is equivalent. `--out /path/to/runs` changes the output location. Run a custom suite with `node bin/loooom.js gym run /path/to/suite-directory`.

## Strategies

- **Repair:** evaluate the original on all cases. Send only failed training cases to the editor. Ask for a small change. Run the candidate on the same suite, including holdout cases. Accept only if at least one case is fixed, no case regresses, and every candidate case passes. If no training case fails, stop with `no-defect`.
- **Ablate:** keep YAML frontmatter, title, and the `## Agent Behavior` section. Remove the other sections. Accept only if the candidate is shorter, every candidate case passes, and no case regresses. This is one section ablation, not a search for the shortest possible prompt.

Every case uses a fresh CLI process. A separate model call grades the responses against fixed criteria. The judge sees prompts and responses, but not the skill text or variant label. It is the same model, so this is not an independent human assessment. There is one response per case in this version.

The adapter invokes `codex exec` without a shell, with read-only sandboxing, ephemeral sessions, user config disabled, project document loading disabled, shell tools disabled, and web search disabled. It passes the skill and learner message as text. Authentication remains in the existing Codex installation. It has a 180-second timeout and a bounded trace buffer. This is a text-behavior test, not a sandbox for arbitrary untrusted agent execution.

## Recorded experiments

Source skills are snapshots of website commit `aa4dcee816171f8483ccd46dac55e5c8ce7d5287`. They stay agent-agnostic.

- `absorb`: the unchanged skill passed 4/4 cases. No repair was proposed.
- `absorb-regression`: a **deliberately introduced defect** tells the coach to reveal answers immediately. The baseline passed 1/4 cases. Repair passed 4/4. This validates the repair path; it is not evidence of a defect in the unchanged skill.
- `focus`: removing all but Agent Behavior cut the file from 948 to 157 whitespace-counted words, including frontmatter (83%). In suite v2, the original passed 3/3 and the candidate passed 2/3. The shorter candidate scheduled 20 minutes of work and then a five-minute break for a 20-minute window. The gym rejected it.

The first focus run used vague ordering criteria: “Starts with” and “Ends with.” The judge treated those as literal response-order constraints. Suite v2 clarified the intended behavior, and **both variants were rerun**. The v1 report remains in `runs/`; do not compare scores across suite hashes. The holdout wording was revised after inspection, so it is a small development check, not a pristine unseen benchmark.

These outcomes apply to these saved responses only. A passing case does not establish durable learning, focus improvement, statistical significance, or general robustness. Inspect the response and grading reason before accepting a change. Future work should add repeated trials, new untouched holdouts, deterministic checks where useful, and a no-skill baseline.

## Reports and recovery

Each run writes a UUID-named JSON report to `gym/runs/`. It contains the full suite, exact skill content, SHA-256 content hashes, word/byte counts, responses, criterion judgments, model selection, CLI version, timestamps, and acceptance decision. The suite hash covers the original `suite.json` bytes. Word counts are not tokenizer counts or cost estimates.

Partial results are saved after each answer. CLI or validation failures produce an `error` report. Complete judgments are validated for exact case IDs and criterion order. Exit code 0 means a completed accepted or no-defect run, 2 means a rejected candidate, and 1 means an error. A failed candidate is a valid experimental result.

Raw prompts, schemas, output, and traces are saved under the ignored `gym/runs/.work/` directory. Review reports before publishing them; custom suites may contain private text. The runner never changes the source skill or installs a candidate. Extract `candidate.content` from an accepted report only after review.

## Website

The interface lives at `/gym` in `mager/loooom.xyz`. It reads curated reports bundled with the site and also lets visitors open a local JSON report without uploading it. There is no browser endpoint that executes Codex.

From the website checkout:

```sh
npm run gym:import -- ../loooom/gym/runs/<run-id>.json
npm run test:gym
npm run check
npm run build
```

The importer validates the report and content hashes, then updates `src/lib/data/gym/<suite-id>.json`. Commit and deploy the website to update the public example. Earlier run files remain in the runner repository.

## Custom suites

Copy an example directory. Keep `SKILL.md` and `suite.json` together. The suite needs a unique ID, a strategy (`repair` or `ablate`), and cases with unique IDs, `train` or `holdout` splits, prompts, titles, and nonempty criteria. Include a descriptive title, description, version, and HTTPS GitHub source URL if you will use the report viewer. Set `skillName` when the suite ID differs from the skill's frontmatter name.

Write criteria before seeing candidate output. Keep holdout prompts out of edits. Any change to tests starts a new comparison, with both variants evaluated again.
