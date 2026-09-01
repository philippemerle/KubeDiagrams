#!/usr/bin/env node
'use strict';

// The interactive viewer is shared between the CLI (documented as
// `open interactive_viewer/index.html` at the repo root) and this webapp
// (served from public/interactive_viewer/). To avoid keeping two diverging
// copies, the repo-root interactive_viewer/ is the single source of truth;
// this script copies it into public/ before dev/build.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const source = path.resolve(__dirname, '..', '..', '..', 'interactive_viewer');
const dest = path.resolve(__dirname, '..', 'public', 'interactive_viewer');

if (!fs.existsSync(source)) {
  if (fs.existsSync(dest)) {
    // Docker builds COPY interactive_viewer/ directly into public/ (the repo
    // root isn't available inside the flattened build context) — nothing to do.
    console.log(`[sync-interactive-viewer] Source not found (${source}), but ${dest} already exists — skipping.`);
    process.exit(0);
  }
  console.error(`[sync-interactive-viewer] Source not found: ${source}`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(source, dest, { recursive: true });
console.log(`[sync-interactive-viewer] Copied ${source} -> ${dest}`);