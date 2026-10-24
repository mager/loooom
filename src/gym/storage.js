import { mkdir, writeFile, rename } from 'node:fs/promises';
import { join, resolve } from 'node:path';

/** A separate persistence adapter keeps the experiment engine free of filesystem writes. */
export function createFileStore(directory) {
  const root = resolve(directory);
  return { async save(report) {
    if (!/^[a-z0-9-]+$/.test(report.id)) throw new Error('Invalid report ID.');
    await mkdir(root,{recursive:true});
    const target=join(root,`${report.id}.json`), temporary=`${target}.tmp`;
    await writeFile(temporary,JSON.stringify(report,null,2)+'\n');
    await rename(temporary,target);
    return target;
  } };
}
