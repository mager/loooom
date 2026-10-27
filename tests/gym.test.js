import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ablate, compare, hash, validateGrades, validateSuite, version } from '../src/gym/core.js';
import { runGym } from '../src/gym/runner.js';

const suite = { id: 'test', strategy: 'repair', cases: [
 { id: 'train', title: 'Training', split: 'train', prompt: 'TRAIN_INPUT', criteria: ['Wait for a reply.'] },
 { id: 'holdout', title: 'Holdout', split: 'holdout', prompt: 'SECRET_HOLDOUT', criteria: ['Ask a question.'] }
] };
const original = '---\nname: test\ndescription: Test\n---\n\n# Test\n\nLong explanation.\n\n## Agent Behavior\n\n- Ask a question.\n';
const graded = pass => suite.cases.map(c => ({ id: c.id, checks: c.criteria.map(criterion => ({ criterion, pass, reason: 'Observed response.' })) }));

test('ablation removes the explanation and preserves behavior and metadata', () => {
 const result = ablate(original);
 assert.match(result, /name: test/); assert.match(result, /Ask a question/); assert.doesNotMatch(result, /Long explanation/);
 assert.ok(result.length < original.length); assert.throws(() => ablate('# Missing headings'));
});
test('suite validation rejects duplicate IDs and absent holdout', () => {
 assert.equal(validateSuite(suite), suite);
 assert.throws(() => validateSuite({ ...suite, cases: [suite.cases[0], suite.cases[0]] }));
 assert.throws(() => validateSuite({ ...suite, cases: suite.cases.map(c => ({...c, split: 'train'})) }));
});
test('judge results cannot drop criteria, reorder them, or invent cases', () => {
 assert.equal(validateGrades(suite.cases, graded(true)).length, 2);
 assert.throws(() => validateGrades(suite.cases, graded(true).slice(1)));
 const bad = graded(true); bad[0].checks[0].criterion = 'Different criterion';
 assert.throws(() => validateGrades(suite.cases, bad));
});
test('acceptance blocks regressions, unrepaired failures, and unchanged ablations', () => {
 const before = [{id:'a',passed:false},{id:'b',passed:true}];
 const fixed = [{id:'a',passed:true},{id:'b',passed:true}];
 assert.equal(compare(before,fixed,{words:100},{words:110},'repair').accepted,true);
 assert.equal(compare(before,[{id:'a',passed:true},{id:'b',passed:false}],{words:100},{words:10},'repair').accepted,false);
 assert.equal(compare(fixed,fixed,{words:100},{words:100},'ablate').accepted,false);
 assert.equal(compare(fixed,fixed,{words:100},{words:10},'ablate').accepted,true);
 assert.equal(compare(fixed,fixed,{words:100},{words:101},'repair').accepted,false);
 assert.equal(hash(original), version(original).hash);
});

async function fixture(t) {
 const dir = await mkdtemp(join(tmpdir(), 'gym-test-'));
 t.after(() => rm(dir, {recursive:true,force:true}));
 await writeFile(join(dir,'suite.json'),JSON.stringify(suite));
 await writeFile(join(dir,'SKILL.md'),original);
 return dir;
}
test('repair uses failed training evidence only and reruns every case', async t => {
 const dir = await fixture(t), prompts = [];
 const adapter = { cliVersion: 'test', async complete(prompt, schema, label) {
  prompts.push({prompt,label});
  if (label === 'repair') return { data: {content: original + '\nWait for the learner.\n',rationale:'Wait before revealing answers.'} };
  if (label.endsWith('judge')) return {data:{grades:graded(label.startsWith('candidate'))}};
  return {data:{response:'What do you recall?'},elapsedMs:1};
 }};
 const {run,resultPath} = await runGym({suiteDir:dir,outputDir:join(dir,'runs'),adapter,onProgress:()=>{}});
 assert.equal(run.status,'accepted'); assert.equal(run.candidate.results.length,2);
 const repair = prompts.find(p => p.label === 'repair').prompt;
 assert.ok(repair.includes('TRAIN_INPUT')); assert.ok(!repair.includes('SECRET_HOLDOUT'));
 assert.equal(run.baseline.content,original);
 assert.equal(JSON.parse(await readFile(resultPath,'utf8')).status,'accepted');
});
test('no defect stops without proposing a change', async t => {
 const dir = await fixture(t);
 const adapter = { cliVersion: 'test', async complete(prompt,schema,label) {
  assert.ok(!label.startsWith('candidate') && label !== 'repair');
  return label.endsWith('judge') ? {data:{grades:graded(true)}} : {data:{response:'Question?'},elapsedMs:1};
 }};
 const {run} = await runGym({suiteDir:dir,outputDir:join(dir,'runs'),adapter,onProgress:()=>{}});
 assert.equal(run.status,'no-defect'); assert.equal(run.candidate,null);
});
test('model failure preserves an error report and completed answers', async t => {
 const dir = await fixture(t); let calls=0;
 const adapter = {cliVersion:'test',async complete() { if (++calls > 1) throw new Error('Offline'); return {data:{response:'First saved answer'},elapsedMs:1}; }};
 const outputDir=join(dir,'runs');
 await assert.rejects(runGym({suiteDir:dir,outputDir,adapter,onProgress:()=>{}}),/Offline/);
 const [file]=await readdir(outputDir), run=JSON.parse(await readFile(join(outputDir,file),'utf8'));
 assert.equal(run.status,'error'); assert.equal(run.baseline.results[0].response,'First saved answer');
});
