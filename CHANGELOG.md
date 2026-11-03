# Changelog

## 0.3.0

- Add `loooom gym run` for one-pass repair and section ablation.
- Add `loooom gym climb` for repeated training trials, bounded candidate search, and fresh verification after selection.
- Export the engine from `loooom/gym`, with TypeScript types, custom model adapters, separate persistence, call budgets, and cancellation.
- Include Absorb and Focus examples, a labeled controlled regression, and the verified 242-word Focus candidate.
- Save exact skill versions, responses, criterion judgments, hashes, and rejected rounds. Preserve partial reports on failure.
- Require Node 22 or later. Existing skill installation commands remain available.
