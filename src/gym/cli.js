import { mkdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCodex } from './codex.js';
import { runGym } from './runner.js';
import { hillClimb } from './climb.js';
import { createFileStore } from './storage.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const examples = ['absorb', 'focus', 'absorb-regression', 'absorb-climb', 'focus-climb'];
export async function gym(args) {
  if (!['run','climb'].includes(args[0]) || !args[1]) {
    console.log(`Loooom skills gym\n\nUsage:\n  loooom gym run <example|suite-directory> [--model MODEL] [--out DIRECTORY]\n  loooom gym climb <example|suite-directory> [--rounds 3] [--repetitions 3] [--max-calls 150] [--model MODEL] [--out DIRECTORY]\n\nExamples: ${examples.join(', ')}\n\nRequires a signed-in Codex CLI. Runs locally; writes versioned JSON reports.\nClimb selects on training cases, then verifies a locked candidate on fresh responses and holdout cases.`);
    if (args.length && !['--help','-h'].includes(args[0])) process.exitCode = 1;
    return;
  }
  const options = {};
  const allowed = args[0] === 'climb' ? ['--model','--out','--rounds','--repetitions','--max-calls'] : ['--model','--out'];
  for (let i = 2; i < args.length; i += 2) {
    if (!allowed.includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Unknown or incomplete option: ${args[i]}`);
    options[args[i].slice(2)] = args[i + 1];
  }
  const suiteDir = examples.includes(args[1]) ? join(root, 'gym/examples', args[1]) : resolve(args[1]);
  const outputDir = resolve(options.out || 'gym/runs');
  const workDir = join(outputDir, '.work', `${Date.now()}-${process.pid}`);
  // Validate inputs before starting a model adapter or creating run directories.
  const suite = JSON.parse(await readFile(join(suiteDir,'suite.json'),'utf8'));
  const content = await readFile(join(suiteDir,'SKILL.md'),'utf8');
  await mkdir(workDir, { recursive: true });
  const adapter = createCodex({ model: options.model, workDir });
  if (args[0] === 'run') {
    const {run,resultPath} = await runGym({suiteDir,outputDir,adapter,model:options.model});
    console.log(`${run.status}: ${run.decision.reason}\n${resultPath}`);
    if (run.status === 'rejected') process.exitCode = 2;
    return;
  }
  const store=createFileStore(outputDir), controller=new AbortController();
  const cancel=()=>controller.abort(); process.once('SIGINT',cancel);
  let resultPath;
  try {
    const session = await hillClimb({ content,suite,adapter,
      repetitions:Number(options.repetitions ?? 3), maxRounds:Number(options.rounds ?? 3), maxCalls:Number(options['max-calls'] ?? 150),signal:controller.signal,
      checkpoint:async report => { resultPath=await store.save(report); },
      onEvent:event => { if (event.type === 'round') console.error(`Round ${event.index}: ${event.status} · ${event.passed}/${event.total} · ${event.words} words`); if(event.type==='verification')console.error('Candidate locked. Running fresh verification.'); }
    });
    console.log(`${session.status}: ${session.calls} model calls\n${resultPath}`);
    if (['not-verified','no-improvement'].includes(session.status)) process.exitCode=2;
  } catch(error) { throw new Error(`${error.message}\nPartial session: ${resultPath ?? 'not created'}`,{cause:error}); }
  finally { process.removeListener('SIGINT',cancel); }
}
