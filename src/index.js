import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const API = 'https://loooom.xyz/api/skills';

function help() {
  console.log(`
  loooom — add skills from loooom.xyz

  Usage:
    npx loooom add <author>/<skill>   Add a skill to your project
    npx loooom search <query>         Search for skills (coming soon)
    npx loooom help                   Show this help

  Examples:
    npx loooom add mager/code-review
    npx loooom add loooom/testing
`);
}

async function add(ref) {
  if (!ref || !ref.includes('/')) {
    console.error('  Error: specify author/skill, e.g. npx loooom add mager/code-review');
    process.exit(1);
  }

  const [author, skill] = ref.split('/', 2);
  const url = `${API}/${author}/${skill}`;

  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    console.error('  Error: could not connect to loooom.xyz');
    process.exit(1);
  }

  if (!res.ok) {
    if (res.status === 404) {
      console.error(`  Error: skill "${author}/${skill}" not found`);
    } else {
      console.error(`  Error: API returned ${res.status}`);
    }
    process.exit(1);
  }

  const data = await res.json();
  const files = data.skill?.files ?? [];
  const title = data.skill?.title ?? skill;
  const dir = join('.claude', 'skills', skill);

  mkdirSync(dir, { recursive: true });

  for (const file of files) {
    writeFileSync(join(dir, file.name), file.content, 'utf-8');
  }

  console.log(`  ✓ Added ${title} by @${author} to ${dir}/`);
  console.log(`  Claude Code will automatically pick it up.`);
}

function search(_query) {
  console.log('  Coming soon');
}

export function run(args) {
  const cmd = args[0];

  switch (cmd) {
    case 'add':
      add(args[1]);
      break;
    case 'search':
      search(args.slice(1).join(' '));
      break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      help();
      break;
    default:
      console.error(`  Unknown command: ${cmd}`);
      help();
      process.exit(1);
  }
}
