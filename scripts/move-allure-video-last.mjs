#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Allure 3 interleaves test attachments and steps. Playwright's automatic video
// currently appears before After Hooks and stdout; display it after everything.
const resultsDir = 'allure-report/data/test-results';
const isVideo = (step) =>
  step?.type === 'attachment' && step.link?.contentType?.startsWith('video/');

for (const filename of await readdir(resultsDir)) {
  if (!filename.endsWith('.json')) continue;

  const path = join(resultsDir, filename);
  const result = JSON.parse(await readFile(path, 'utf8'));
  if (!Array.isArray(result.steps)) continue;

  const videos = result.steps.filter(isVideo);
  if (videos.length === 0) continue;

  result.steps = [...result.steps.filter((step) => !isVideo(step)), ...videos];
  await writeFile(path, JSON.stringify(result));
}
