# Use the gym as a library

The gym stays in Loooom. The `loooom/gym` export is the boundary for a later standalone package. The engine accepts skill text, a suite, and adapters. It does not read project files, install a candidate, or publish results.

```js
import { readFile } from 'node:fs/promises';
import { createCodexAdapter, createFileStore, hillClimb } from 'loooom/gym';

const content = await readFile('./SKILL.md', 'utf8');
const suite = JSON.parse(await readFile('./suite.json', 'utf8'));
const adapter = createCodexAdapter({
  model: 'gpt-6-astra',
  workDir: './gym/runs/.work/local-session'
});
const store = createFileStore('./gym/runs');
const session = await hillClimb({
  content, suite, adapter,
  repetitions: 3,
  maxRounds: 3,
  maxCalls: 150,
  checkpoint: report => store.save(report).then(() => {}),
  onEvent: event => console.log(event.type, event.calls)
});

console.log(session.status);
// Only `verified` is eligible for promotion. Review the evidence first.
```

Use a unique `workDir` for each concurrent session. The CLI does this automatically.

## Adapter contract

An adapter implements `complete(prompt, schema, label, { signal })` and returns `{ data, elapsedMs }`. `data` is parsed JSON matching the requested JSON Schema. It can use any model backend. The engine validates response content and complete judge case/criterion coverage. A judge and proposer can be supplied as separate adapters; both default to the execution adapter.

The Codex adapter is one implementation. It supports cancellation, timeouts, output limits, and local traces. It uses the existing CLI sign-in. Call limits count all execution, grading, and proposal calls, including failed calls. They do not bound model tokens or money.

## Search and verification

1. Freeze the suite for the session. Evaluate the original on training cases, with repeated responses.
2. Propose a candidate from training cases and evidence only. When an Agent Behavior section exists, the first ablation removes the other sections. Other layouts start with the model editor. Later ablations use a model to shorten the incumbent while addressing rejected candidates' training failures.
3. Reject any decrease in a training case's passing samples. Repairs must increase total passing samples. Shortening must reduce words and pass every training sample.
4. Keep the incumbent when a candidate is rejected. Stop at the round budget, an unchanged candidate, or a fully passing repair objective.
5. Lock the selected version. Run both original and selected versions again on all cases, including holdouts. These are fresh responses, not reused search scores.
6. A final candidate must satisfy the objective, have no per-case regression, and pass every fresh sample. Otherwise the session is `not-verified` and the original remains the safe default.

A no-change search measures the original on holdouts but reports `no-defect` or `no-improvement`; it does not invent a candidate. `no-defect` refers to the training set, so inspect the holdout result too.

Verification feedback never returns to the editor in that session. If you inspect a holdout and use it to plan another experiment, it is now development data. Reserve a fresh holdout for the next claim.

## Data and failure behavior

Schema 2 reports contain the original version, training baseline, every round, selected candidate, fresh verification, and call budget. Content hashes identify skill versions. The suite hash covers `JSON.stringify(suite)` for schema 2; schema 1 hashes the original suite file bytes. Do not compare hashes across these serialization methods.

`checkpoint` receives independent snapshots, including partial answers, after each response. Save them anywhere: a file, database, or object store. `createFileStore` writes JSON atomically through a temporary file. Keep one writer per session ID.

Failures throw an error with the partial `session` attached. The last checkpoint has status `error` or `cancelled`. Nothing is silently promoted on failure. An `AbortSignal` stops new model calls; the Codex adapter also kills the current CLI process. Other adapters must implement their own signal handling.

Scores are empirical pass counts, with per-case counts. The library returns a descriptive Wilson interval, but repeated outputs can be correlated and model judges can be wrong. This is not a significance test or proof of a causal effect. Use independent review, larger test sets, repeat sessions, and a no-skill control for stronger claims.
