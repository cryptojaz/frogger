#!/usr/bin/env ts-node
import { promises as fs } from 'fs';
import * as path from 'path';

async function walk(dir: string, indent = ''): Promise<void> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;          // skip!
    const icon = entry.isDirectory() ? '📁' : '📄';
    console.log(`${indent}${icon} ${entry.name}`);
    if (entry.isDirectory()) {
      await walk(path.join(dir, entry.name), indent + '  ');
    }
  }
}

walk(process.cwd()).catch(err => {
  console.error('💥  Failed to walk directory:', err);
  process.exit(1);
});
