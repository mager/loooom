import { mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCodex } from './codex.js';
import { runGym } from './runner.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
export async function gym(args) {
  if (args[0] !== 'run' || !args[1]) {
    console.log('Usage: loooom gym run <absorb|absorb-regression|focus|suite-directory> [--model MODEL] [--out DIRECTORY]\nRequires a signed-in Codex CLI. Runs locally; writes versioned JSON reports.');
    if (args.length && args[0] !== '--help') process.exitCode = 1;
    return;
  }
  const options = {};
  for (let i = 2; i < args.length; i += 2) {
    if (!['--model', '--out'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Unknown or incomplete option: ${args[i]}`);
    options[args[i].slice(2)] = args[i + 1];
  }
  const suiteDir = ['absorb', 'focus', 'absorb-regression'].includes(args[1]) ? join(root, 'gym/examples', args[1]) : resolve(args[1]);
  const outputDir = resolve(options.out || 'gym/runs');
  const workDir = join(outputDir, '.work', `${Date.now()}-${process.pid}`);
  await mkdir(workDir, { recursive: true });
  const adapter = createCodex({ model: options.model, workDir });
  const { run, resultPath } = await runGym({ suiteDir, outputDir, adapter, model: options.model });
  console.log(`${run.status}: ${run.decision.reason}\n${resultPath}`);
  if (run.status === 'rejected') process.exitCode = 2;
}
