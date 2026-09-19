#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const [, , sourceArg, siteArg, runId] = process.argv;
if (!sourceArg || !siteArg || !/^[1-9]\d*$/.test(runId ?? '')) {
  throw new Error('Usage: node scripts/retain-allure.mjs <allure-report-dir> <site-dir> <numeric-run-id>');
}

const sourceDir = resolve(sourceArg);
const siteDir = resolve(siteArg);
if (sourceDir === siteDir || siteDir.startsWith(`${sourceDir}/`) || sourceDir.startsWith(`${siteDir}/`)) {
  throw new Error('The report and site directories must be separate.');
}
if (!(await stat(join(sourceDir, 'index.html')).catch(() => null))?.isFile()) {
  throw new Error(`No generated Allure index.html in ${sourceDir}`);
}

const runsDir = join(siteDir, 'runs');
const manifestPath = join(siteDir, '.retained-runs.json');
await mkdir(runsDir, { recursive: true });
const reportDestination = join(runsDir, runId);
await rm(reportDestination, { recursive: true, force: true });
await cp(sourceDir, reportDestination, { recursive: true });

let previousRuns = [];
const manifest = await readFile(manifestPath, 'utf8').catch((error) => {
  if (error.code === 'ENOENT') return null;
  throw error;
});
if (manifest !== null) {
  const parsed = JSON.parse(manifest);
  if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === 'string' && /^[1-9]\d*$/.test(id))) {
    throw new Error('Invalid report retention manifest');
  }
  previousRuns = parsed;
}

const existingRuns = (await readdir(runsDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^[1-9]\d*$/.test(entry.name))
  .map((entry) => entry.name);
const existing = new Set(existingRuns);
const keep = [...new Set([runId, ...previousRuns, ...existingRuns.sort((a, b) =>
  BigInt(a) > BigInt(b) ? -1 : BigInt(a) < BigInt(b) ? 1 : 0
)])].filter((id) => existing.has(id)).slice(0, 5);

for (const id of existingRuns) {
  if (!keep.includes(id)) await rm(join(runsDir, id), { recursive: true, force: true });
}
await writeFile(manifestPath, `${JSON.stringify(keep, null, 2)}\n`);
await writeFile(join(siteDir, 'index.html'), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=runs/${runId}/"><title>Allure report</title></head><body><a href="runs/${runId}/">Open the latest Allure report</a></body></html>\n`);
await writeFile(join(siteDir, '.nojekyll'), '');
console.log(`Published Allure run ${runId}; retained ${keep.join(', ')}`);
