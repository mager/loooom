import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSkill, summarize, compareEvaluations, hillClimb, validateProposal } from '../src/gym/index.js';

const skill = '---\nname: test\ndescription: Testing\n---\n\n# Test\n\nBackground with extra explanations and examples.\n\n## Agent Behavior\nAsk a question and wait.\n';
const suite = {id:'test',strategy:'repair',cases:[
 {id:'train',title:'Train',split:'train',prompt:'TRAIN_INPUT',criteria:['Ask a question.']},
 {id:'holdout',title:'Holdout',split:'holdout',prompt:'HOLDOUT_SECRET',criteria:['Wait for the learner.']}
]};
const evalRows = (content,values) => ({content,words:content.length,score:summarize(values.map((passed,i)=>({caseId:'one',passed,id:`${i}`})))});
function fakeAdapter({baselinePass=false,candidatePass=true,verifyPass=true}={}) {
 const calls=[];
 return {model:'test-model',calls,async complete(prompt,schema,label) {
  calls.push({prompt,label});
  if(label.endsWith('propose'))return {data:{content:skill+'\nWait for a response before explaining.\n',rationale:'Preserve the attempt.'}};
  if(label.includes('-judge-r')) {
   const packet=JSON.parse(prompt.split('\n\n').at(-1));
   const pass=label.startsWith('baseline') || label.startsWith('verify-original') || label.startsWith('original-holdout') ? baselinePass : label.startsWith('verify-candidate') ? verifyPass : candidatePass;
   return {data:{grades:packet.map(c=>({id:c.id,checks:c.criteria.map(criterion=>({criterion,pass,reason:'Visible evidence.'}))}))}};
  }
  return {data:{response:'What do you remember?'},elapsedMs:1};
 }};
}
test('repeated evaluation grades every sample and records per-case rates',async()=>{
 const adapter=fakeAdapter({baselinePass:true});
 const result=await evaluateSkill({content:skill,cases:suite.cases,adapter,repetitions:3,label:'baseline'});
 assert.equal(result.samples.length,6);assert.equal(result.score.passed,6);assert.equal(result.score.byCase.train.total,3);
 assert.equal(adapter.calls.filter(c=>c.label.includes('judge')).length,3);
});
test('comparison rejects a per-case regression even if the total improves',()=>{
 const before={words:100,score:summarize([{caseId:'a',passed:true},{caseId:'b',passed:false},{caseId:'b',passed:false}])};
 const after={words:90,score:summarize([{caseId:'a',passed:false},{caseId:'b',passed:true},{caseId:'b',passed:true}])};
 assert.equal(compareEvaluations(before,after,'repair').accepted,false);
 assert.throws(()=>compareEvaluations(before,{...after,score:summarize([])},'repair'));
});
test('shortening requires all trials to pass and fewer words',()=>{
 assert.equal(compareEvaluations(evalRows('long',[true,true]),evalRows('x',[true,true]),'ablate').accepted,true);
 assert.equal(compareEvaluations(evalRows('long',[true,true]),evalRows('x',[true,false]),'ablate').accepted,false);
});
test('editor never sees holdout evidence; fresh verification locks the selection',async()=>{
 const adapter=fakeAdapter(); const reports=[];
 const result=await hillClimb({content:skill,suite,adapter,repetitions:2,maxRounds:3,checkpoint:async r=>reports.push(r)});
 assert.equal(result.status,'verified');assert.equal(result.rounds.length,1);
 assert.equal(result.verification.candidate.score.total,4);
 const edit=adapter.calls.find(c=>c.label.endsWith('propose')).prompt;
 assert.ok(edit.includes('TRAIN_INPUT'));assert.ok(!edit.includes('HOLDOUT_SECRET'));assert.ok(!edit.includes('Wait for the learner.'));
 const firstVerify=adapter.calls.findIndex(c=>c.label.startsWith('verify-'));
 assert.ok(adapter.calls.slice(firstVerify).every(c=>!c.label.endsWith('propose')));
 assert.equal(reports.at(-1).status,'verified');
});
test('passing training does not promote a candidate that fails fresh verification',async()=>{
 const result=await hillClimb({content:skill,suite,adapter:fakeAdapter({verifyPass:false}),repetitions:1,maxRounds:2});
 assert.equal(result.rounds[0].status,'accepted');assert.equal(result.status,'not-verified');assert.equal(result.verification.decision.accepted,false);
});
test('no training defect makes no proposal and does not claim an improvement',async()=>{
 const adapter=fakeAdapter({baselinePass:true});
 const result=await hillClimb({content:skill,suite,adapter,repetitions:1});
 assert.equal(result.status,'no-defect');assert.equal(result.rounds.length,0);assert.ok(!adapter.calls.some(c=>c.label.endsWith('propose')));
});
test('budget exhaustion saves partial state and does not exceed the budget',async()=>{
 let saved;const adapter=fakeAdapter();
 await assert.rejects(hillClimb({content:skill,suite,adapter,repetitions:2,maxCalls:1,checkpoint:async r=>saved=r}),/budget exhausted/);
 assert.equal(saved.status,'error');assert.equal(saved.calls,1);assert.equal(saved.inProgress.samples.length,1);assert.equal(adapter.calls.length,1);
});
test('cancellation stops before a model call',async()=>{
 const controller=new AbortController();controller.abort();const adapter=fakeAdapter();let saved;
 await assert.rejects(hillClimb({content:skill,suite,adapter,signal:controller.signal,checkpoint:async r=>saved=r}));
 assert.equal(saved.status,'cancelled');assert.equal(adapter.calls.length,0);
});
test('candidate cannot change frontmatter or omit it',()=>{
 assert.equal(validateProposal(skill,skill),skill);
 assert.throws(()=>validateProposal(skill,skill.replace('name: test','name: other')));
 assert.throws(()=>validateProposal(skill,'# test'));
});
test('callbacks cannot mutate evaluation evidence or the frozen suite',async()=>{
 const adapter=fakeAdapter({baselinePass:true});
 const mutableSuite=structuredClone(suite);
 const result=await hillClimb({content:skill,suite:mutableSuite,adapter,repetitions:1,checkpoint:async()=>{mutableSuite.cases[0].prompt='MUTATED';}});
 assert.equal(result.suite.cases[0].prompt,'TRAIN_INPUT');
 assert.ok(adapter.calls.some(c=>c.prompt.includes('TRAIN_INPUT')));
 const evaluated=await evaluateSkill({content:skill,cases:suite.cases,adapter,repetitions:1,label:'baseline',onSample:async(sample,samples)=>{sample.response='MUTATED';samples[0].response='MUTATED';}});
 assert.equal(evaluated.samples[0].response,'What do you remember?');
});
test('public evaluation rejects invalid or duplicate cases before model calls',async()=>{
 const adapter=fakeAdapter();
 for(const cases of [[suite.cases[0],suite.cases[0]],[{...suite.cases[0],id:'../escape'}],[{...suite.cases[0],criteria:[]}],[null]]) await assert.rejects(evaluateSkill({content:skill,cases,adapter}));
 assert.equal(adapter.calls.length,0);
});
test('ablation supports a skill with a different section layout',async()=>{
 const adapter=fakeAdapter({baselinePass:true});
 const content=skill.replace('## Agent Behavior','## Instructions');
 const result=await hillClimb({content,suite:{...suite,strategy:'ablate'},adapter,repetitions:1,maxRounds:1});
 assert.ok(adapter.calls.some(c=>c.label==='round-1-propose'));
 assert.equal(result.rounds.length,1);
});
