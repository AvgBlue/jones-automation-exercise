import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../../scripts/retain-allure.mjs', import.meta.url));

async function fixture() {
  const temporary = await mkdtemp(join(tmpdir(), 'jones-allure-'));
  const source = join(temporary, 'source');
  const site = join(temporary, 'site');
  await mkdir(source);
  await writeFile(join(source, 'index.html'), '<h1>Allure</h1>');
  await writeFile(join(source, 'attachment.png'), 'sample attachment');
  return { temporary, source, site };
}

function publish(source, site, id) {
  execFileSync(process.execPath, [script, source, site, id], { stdio: 'pipe' });
}

async function runIds(site) {
  return (await readdir(join(site, 'runs'))).sort();
}

test('publishes a complete Allure report and a latest-report redirect', async () => {
  const { temporary, source, site } = await fixture();
  try {
    publish(source, site, '100');
    assert.deepEqual(await runIds(site), ['100']);
    assert.match(await readFile(join(site, 'index.html'), 'utf8'), /runs\/100\//);
    assert.equal(await readFile(join(site, 'runs', '100', 'attachment.png'), 'utf8'), 'sample attachment');
    assert.deepEqual(JSON.parse(await readFile(join(site, '.retained-runs.json'), 'utf8')), ['100']);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('keeps exactly the five latest published runs', async () => {
  const { temporary, source, site } = await fixture();
  try {
    for (const id of ['100', '101', '102', '103', '104', '105']) publish(source, site, id);
    assert.deepEqual(await runIds(site), ['101', '102', '103', '104', '105']);
    assert.deepEqual(JSON.parse(await readFile(join(site, '.retained-runs.json'), 'utf8')), ['105', '104', '103', '102', '101']);
    assert.match(await readFile(join(site, 'index.html'), 'utf8'), /runs\/105\//);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('re-running an older retained run makes it newest without exceeding five', async () => {
  const { temporary, source, site } = await fixture();
  try {
    for (const id of ['100', '101', '102', '103', '104']) publish(source, site, id);
    publish(source, site, '101');
    assert.deepEqual(JSON.parse(await readFile(join(site, '.retained-runs.json'), 'utf8')), ['101', '104', '103', '102', '100']);
    publish(source, site, '105');
    assert.deepEqual(await runIds(site), ['101', '102', '103', '104', '105']);
    assert.match(await readFile(join(site, 'index.html'), 'utf8'), /runs\/105\//);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('rejects invalid run IDs without creating run folders', async () => {
  const { temporary, source, site } = await fixture();
  try {
    assert.throws(() => publish(source, site, '../unsafe'));
    assert.throws(() => publish(source, site, '0'));
    assert.throws(() => publish(source, site, 'not-a-run'));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('rejects missing generated report index', async () => {
  const { temporary, source, site } = await fixture();
  try {
    await rm(join(source, 'index.html'));
    assert.throws(() => publish(source, site, '200'));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
