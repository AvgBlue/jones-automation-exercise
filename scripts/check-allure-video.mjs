#!/usr/bin/env node
import { appendFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const reportDir = 'allure-report';
const attachmentDir = join(reportDir, 'data', 'attachments');
const videoFiles = (await readdir(attachmentDir)).filter((name) => name.endsWith('.webm'));
if (videoFiles.length === 0) {
  throw new Error('Allure report contains no WebM video attachment.');
}

const videoBytes = (await Promise.all(videoFiles.map(async (name) => {
  const size = (await stat(join(attachmentDir, name))).size;
  if (size === 0) throw new Error(`Empty Allure video: ${name}`);
  return size;
}))).reduce((sum, size) => sum + size, 0);

async function directoryBytes(dir) {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) total += await directoryBytes(path);
    else if (entry.isFile()) total += (await stat(path)).size;
  }
  return total;
}

const reportBytes = await directoryBytes(reportDir);
const mib = (bytes) => (bytes / 1024 ** 2).toFixed(2);
const summary = [
  '## Allure video storage check',
  '',
  `- Videos embedded in generated report: **${videoFiles.length}**`,
  `- Video size: **${mib(videoBytes)} MiB**`,
  `- Complete report size: **${mib(reportBytes)} MiB**`,
  `- Five similar reports (estimate): **${mib(reportBytes * 5)} MiB**`,
  '',
].join('\n');
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}
