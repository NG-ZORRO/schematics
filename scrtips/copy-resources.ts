import * as fs from 'fs-extra';
import * as path from 'path';

const srcPath = path.join(process.cwd(), 'src');
const targetPath = path.join(process.cwd(), 'dist/schematics');
const copyFilter = (p: string) => !p.endsWith('.ts');

export function copyResources(): void {
  fs.copySync(srcPath, targetPath, { filter: copyFilter });
}
copyResources();
