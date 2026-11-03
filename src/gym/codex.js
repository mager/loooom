import { spawn, execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export function createCodex({ model, workDir, timeoutMs = 180000, onProgress = console.error }) {
  const cliVersion = execFileSync('codex', ['--version'], { encoding: 'utf8' }).trim();
  let calls = 0;
  async function complete(prompt, schema, label, { signal } = {}) {
    signal?.throwIfAborted();
    if (!/^[a-zA-Z0-9_-]+$/.test(label)) throw new Error("Invalid call label.");
    const dir = resolve(workDir, `${String(++calls).padStart(2, '0')}-${label}`);
    await mkdir(dir, { recursive: true });
    const schemaFile = join(dir, 'schema.json');
    const resultFile = join(dir, 'response.json');
    await writeFile(schemaFile, JSON.stringify(schema));
    await writeFile(join(dir, 'prompt.txt'), prompt);
    const args = ['exec', '--ignore-user-config', '--skip-git-repo-check', '--ephemeral', '--sandbox', 'read-only',
      '-c', 'approval_policy="never"', '-c', 'project_doc_max_bytes=0', '-c', 'web_search="disabled"',
      '-c', 'features.shell_tool=false', '-c', 'features.memories=false',
      '--output-schema', schemaFile, '--output-last-message', resultFile, '--color', 'never'];
    if (model) args.push('--model', model);
    args.push('-');
    onProgress(`  ${label}`);
    const started = Date.now();
    // No shell interpolation. Authentication stays in the user's Codex installation.
    const trace = await new Promise((res, rej) => {
      const child = spawn('codex', args, { cwd: dir, stdio: ['pipe', 'pipe', 'pipe'] });
      const abort = () => child.kill('SIGKILL');
      signal?.addEventListener('abort', abort, { once: true });
      if (signal?.aborted) abort();
      let output = '', timedOut = false, tooLarge = false;
      const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, timeoutMs);
      const collect = data => {
        output += data.toString();
        if (output.length > 2_000_000) { tooLarge = true; child.kill('SIGKILL'); }
      };
      child.stdout.on('data', collect);
      child.stderr.on('data', collect);
      child.stdin.on('error', () => {});
      child.on('error', e => { clearTimeout(timer); signal?.removeEventListener('abort', abort); rej(e); });
      child.on('close', code => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', abort);
        if (signal?.aborted) rej(new Error('Codex call cancelled.'));
        else if (timedOut) rej(new Error(`Codex timed out after ${timeoutMs / 1000}s (${label}).`));
        else if (tooLarge) rej(new Error(`Codex exceeded the output limit (${label}).`));
        else if (code !== 0) rej(new Error(`Codex failed (${label}, exit ${code}): ${output.slice(-1800)}`));
        else res(output);
      });
      child.stdin.end(prompt);
    });
    await writeFile(join(dir, 'trace.txt'), trace);
    const data = JSON.parse(await readFile(resultFile, 'utf8'));
    return { data, elapsedMs: Date.now() - started };
  }
  return { complete, cliVersion, name: 'codex-cli', model: model || 'CLI default (unconfigured)' };
}
