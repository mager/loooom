import { createHash } from 'node:crypto';

export const hash = (text) => createHash('sha256').update(text).digest('hex');
export const words = (text) => text.trim().split(/\s+/u).filter(Boolean).length;
export const version = (content) => ({ hash: hash(content), words: words(content), bytes: Buffer.byteLength(content), content });

export function validateSuite(suite) {
  if (!suite || !/^[a-z][a-z0-9-]*$/.test(suite.id) || !['repair', 'ablate'].includes(suite.strategy)) throw new Error('Invalid suite identity or strategy.');
  if (!Array.isArray(suite.cases) || suite.cases.length < 2) throw new Error('A suite needs training and holdout cases.');
  const ids = new Set();
  for (const c of suite.cases) {
    if (!c.id || ids.has(c.id) || !['train', 'holdout'].includes(c.split) || !c.prompt?.trim() || !c.title?.trim() || !Array.isArray(c.criteria) || !c.criteria.length || c.criteria.some(x => typeof x !== 'string' || !x.trim())) throw new Error('Invalid or duplicate test case.');
    ids.add(c.id);
  }
  if (!suite.cases.some(c => c.split === 'train') || !suite.cases.some(c => c.split === 'holdout')) throw new Error('Keep at least one case out of the repair prompt.');
  return suite;
}

export function ablate(content) {
  const frontmatter = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  const behavior = content.match(/^## Agent Behavior\s*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m);
  const heading = content.match(/^# .+$/m);
  if (!frontmatter || !behavior || !heading) throw new Error('Ablation needs frontmatter, a title, and an Agent Behavior section.');
  return `${frontmatter[0]}\n${heading[0]}\n\n## Agent Behavior\n${behavior[1].trim()}\n`;
}

export function validateGrades(cases, grades) {
  if (!Array.isArray(grades) || grades.length !== cases.length) throw new Error('Judge returned an incomplete case list.');
  return cases.map(c => {
    const matches = grades.filter(g => g.id === c.id);
    if (matches.length !== 1) throw new Error(`Judge returned an invalid ID: ${c.id}`);
    const checks = matches[0].checks;
    if (!Array.isArray(checks) || checks.length !== c.criteria.length || checks.some((x, i) => x.criterion !== c.criteria[i] || typeof x.pass !== 'boolean' || typeof x.reason !== 'string' || !x.reason.trim())) throw new Error(`Judge returned invalid criteria: ${c.id}`);
    return { id: c.id, checks, passed: checks.every(x => x.pass) };
  });
}

export function compare(baseline, candidate, before, after, strategy) {
  const regressions = baseline.filter(b => b.passed && !candidate.find(c => c.id === b.id)?.passed).map(c => c.id);
  const fixed = baseline.filter(b => !b.passed && candidate.find(c => c.id === b.id)?.passed).map(c => c.id);
  const allPass = candidate.length === baseline.length && candidate.every(c => c.passed);
  const shorter = after.words < before.words;
  return {
    accepted: allPass && regressions.length === 0 && (strategy === 'repair' ? fixed.length > 0 : shorter),
    fixed, regressions, wordsRemoved: before.words - after.words,
    reductionPercent: Math.round((1 - after.words / before.words) * 100),
    // An accepted candidate is evidence on this suite, never a general quality claim.
    reason: !allPass ? 'Candidate still fails at least one case.' : regressions.length ? 'Candidate introduces a regression.' : strategy === 'repair' && !fixed.length ? 'No observed defect was fixed.' : strategy === 'ablate' && !shorter ? 'Candidate is not shorter.' : 'Candidate meets the acceptance rule on this suite.'
  };
}
