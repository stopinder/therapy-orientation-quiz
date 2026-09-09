import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, createServer, preview } from 'vite';

// Never contact a real project, even when run from a developer's configured repo.
process.env.VITE_SUPABASE_URL = 'https://ui-test.invalid';
process.env.VITE_SUPABASE_ANON_KEY = 'ui-test-placeholder-not-a-secret';
const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const directory = resolve('artifacts/therapist-style');
await mkdir(directory, { recursive: true });
const results = [];
const screenshots = [];
const pageErrors = [];
const apiRequests = [];
let browser, devServer, productionServer, context, page, buildDirectory;

async function check(name, task) {
  try {
    await task();
    results.push({ name, status: 'passed' });
    console.log(`PASS: ${name}`);
  } catch (error) {
    results.push({ name, status: 'failed', error: String(error.message) });
    throw error;
  }
}
async function screenshot(name) {
  const filename = `${name}.png`;
  await page.screenshot({ path: join(directory, filename), fullPage: true });
  screenshots.push(filename);
}
async function noOverflow() {
  const sizes = await page.evaluate(() => ({ width: window.innerWidth, content: document.documentElement.scrollWidth }));
  assert.ok(sizes.content <= sizes.width + 1, `Horizontal overflow: ${JSON.stringify(sizes)}`);
}
async function openQuiz(origin) {
  await page.goto(`${origin}/therapist-style`);
  await page.locator('#ts-title').waitFor();
}
async function begin() {
  await page.getByRole('button', { name: 'Begin the reflection' }).click();
  await page.locator('.ts-shell[data-stage="questions"]').waitFor();
}
async function completeQuestions() {
  for (let index = 0; index < 15; index += 1) {
    await page.waitForFunction(i => document.querySelector('[data-testid="question-progress"]')?.textContent.trim() === `${i + 1} of 15`, index);
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: index === 14 ? 'Review answers' : 'Next', exact: true }).click();
  }
  await page.locator('.ts-shell[data-stage="review"]').waitFor();
}
async function fileTexts(directoryPath) {
  const texts = [];
  for (const entry of await readdir(directoryPath, { withFileTypes: true })) {
    const name = join(directoryPath, entry.name);
    if (entry.isDirectory()) texts.push(...await fileTexts(name));
    else if (/\.(js|html)$/.test(entry.name)) texts.push(await readFile(name, 'utf8'));
  }
  return texts;
}
async function contrast(selector) {
  return page.locator(selector).first().evaluate(element => {
    const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const luminance = values => values.map(value => {
      const channel = value / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const style = getComputedStyle(element);
    const foreground = luminance(rgb(style.color));
    const background = luminance(rgb(style.backgroundColor));
    return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05);
  });
}

try {
  devServer = await createServer({ server: { host: '127.0.0.1', port: 4175, strictPort: true }, logLevel: 'warn' });
  await devServer.listen();
  const origin = 'http://127.0.0.1:4175';
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  context.setDefaultTimeout(12000);
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/api/')) { apiRequests.push(url.pathname); return route.abort(); }
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) return route.abort();
    return route.continue();
  });
  page = await context.newPage();
  page.on('pageerror', error => pageErrors.push(error.message));

  await check('isolated intro, disclaimer, no default mock or marketing header', async () => {
    await openQuiz(origin);
    assert.equal(await page.locator('.ts-preview-notice').count(), 0);
    assert.equal(await page.getByRole('link', { name: 'MindWorks', exact: true }).count(), 0);
    assert.equal(await page.locator('input[type="email"]').count(), 0);
    assert.match(await page.locator('.ts-intro-disclaimer').first().innerText(), /not a validated assessment/);
    await noOverflow();
    assert.ok(await contrast('.ts-button-primary') >= 4.5);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot('desktop-introduction');
  });

  await check('native radio keyboard control, no auto-advance, Back retains choices and focus', async () => {
    await page.getByRole('button', { name: 'Begin the reflection' }).focus();
    await page.keyboard.press('Enter');
    await page.locator('.ts-shell[data-stage="questions"]').waitFor();
    assert.equal(await page.getByRole('radio').count(), 5);
    assert.equal(await page.locator('input[type="radio"]:checked').count(), 0);
    assert.equal(await page.getByRole('button', { name: 'Next', exact: true }).isDisabled(), true);
    await page.getByRole('radio').first().focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.getByRole('radio').nth(1).isChecked(), true);
    assert.equal((await page.getByTestId('question-progress').innerText()).trim(), '1 of 15');
    assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'INPUT');
    const ring = await page.getByRole('radio').nth(1).evaluate(input => getComputedStyle(input.closest('label')).outlineWidth);
    assert.notEqual(ring, '0px');
    assert.ok(await contrast('.ts-option-selected') >= 4.5);
    await screenshot('desktop-question-keyboard-focus');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.tagName === 'LEGEND');
    assert.equal((await page.getByTestId('question-progress').innerText()).trim(), '2 of 15');
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    assert.equal(await page.getByRole('radio').nth(1).isChecked(), true);
  });

  await check('all fifteen scenarios reach review without a report request', async () => {
    await completeQuestions();
    assert.equal(await page.getByRole('button', { name: 'Create reflection', exact: true }).isDisabled(), true);
    assert.equal(apiRequests.length, 0);
  });

  await check('explicit mock enable, failure, retained answers, retry and full report contract', async () => {
    await page.locator('.ts-dev summary').click();
    await page.getByRole('checkbox', { name: 'Simulate a failed first report request' }).check();
    await page.getByRole('button', { name: 'Enable sample report', exact: true }).click();
    await page.getByRole('button', { name: 'Create sample report', exact: true }).click();
    await page.locator('.ts-shell[data-stage="loading"]').waitFor();
    await page.getByTestId('report-error').waitFor();
    await screenshot('report-error-recovery');
    await page.getByRole('button', { name: 'Try sample report again', exact: true }).click();
    await page.locator('.ts-shell[data-stage="report"]').waitFor();
    for (const title of ['Your therapeutic stance', 'How you tend to work', 'Your relationship with expertise', 'What clients may experience', 'Likely strengths', 'Possible tensions or blind spots', 'When your usual style may be less helpful', 'A possible description of your therapeutic identity', 'Questions for your reflection']) {
      assert.equal(await page.getByRole('heading', { name: title, exact: true }).count(), 1);
    }
    assert.match(await page.locator('.ts-report').innerText(), /Development sample — not a personalised AI report/);
    assert.match(await page.locator('.ts-report .ts-disclaimer').innerText(), /not a validated assessment/);
    assert.equal(await page.locator('.ts-report button').filter({ hasText: /Save|Return to Helios/ }).count(), 0);
    await noOverflow();
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot('desktop-report-sample');
    await page.getByRole('button', { name: 'Review my answers', exact: true }).click();
    assert.equal((await page.getByTestId('question-progress').innerText()).trim(), '15 of 15');
    assert.equal(await page.getByRole('radio').first().isChecked(), true);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    assert.equal(await page.getByRole('radio').first().isChecked(), true);
    assert.equal(apiRequests.length, 0);
  });

  for (const width of [390, 320, 768]) {
    await check(`responsive intro and question layout at ${width}px`, async () => {
      await page.setViewportSize({ width, height: 844 });
      await openQuiz(origin);
      await noOverflow();
      await page.evaluate(() => window.scrollTo(0, 0));
      await screenshot(`intro-${width}px`);
      await begin();
      await noOverflow();
      const labels = await page.locator('.ts-option').evaluateAll(elements => elements.map(element => ({ height: element.getBoundingClientRect().height, width: element.getBoundingClientRect().width })));
      assert.ok(labels.every(label => label.height >= 44 && label.width >= 44));
      await screenshot(`question-${width}px`);
    });
  }

  await check('200 percent text size and reduced motion', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openQuiz(origin);
    await begin();
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await noOverflow();
    await screenshot('question-200-percent-text');
    await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const motion = await page.locator('.ts-option').first().evaluate(element => ({ transition: getComputedStyle(element).transitionDuration, animation: getComputedStyle(element).animationName }));
    assert.ok(motion.transition.split(',').every(value => Number.parseFloat(value) === 0));
    assert.equal(motion.animation, 'none');
    await screenshot('question-reduced-motion');
  });

  await check('refresh clears local answers; existing routes retain header and guards', async () => {
    await page.getByRole('radio').first().check();
    await page.reload();
    await page.locator('#ts-title').waitFor();
    await begin();
    assert.equal(await page.locator('input[type="radio"]:checked').count(), 0);
    await page.goto(`${origin}/about`);
    await page.getByRole('link', { name: 'MindWorks', exact: true }).waitFor();
    await page.goto(`${origin}/investigation-starter`);
    await page.waitForURL('**/gateway');
    await page.goto(`${origin}/structured-interview`);
    await page.waitForURL('**/auth?redirect=**');
    await page.goto(`${origin}/course/1`);
    await page.waitForURL('**/auth?redirect=**');
    await page.evaluate(() => sessionStorage.setItem('passedGateway', 'true'));
    await page.goto(`${origin}/investigation-starter`);
    await page.getByRole('heading', { name: 'One place your investigation could begin.', exact: true }).waitFor();
    assert.equal(await page.getByRole('radio').count(), 45);
  });

  await check('production bundle excludes fixture and production UI cannot enable it', async () => {
    buildDirectory = await mkdtemp(join(tmpdir(), 'therapist-style-ui-build-'));
    await build({ logLevel: 'warn', build: { outDir: buildDirectory, emptyOutDir: true } });
    const bundle = (await fileTexts(buildDirectory)).join('\n');
    assert.ok(!bundle.includes('THERAPIST_STYLE_DEV_FIXTURE_ONLY'));
    assert.ok(!bundle.includes('Deliberate development preview failure'));
    productionServer = await preview({ logLevel: 'warn', build: { outDir: buildDirectory }, preview: { host: '127.0.0.1', port: 4176, strictPort: true } });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('http://127.0.0.1:4176/therapist-style?mock=1&return_to=https://example.invalid');
    await page.locator('#ts-title').waitFor();
    assert.equal(await page.getByTestId('development-tools').count(), 0);
    assert.equal(await page.locator('.ts-preview-notice').count(), 0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot('production-introduction');
    await begin();
    await completeQuestions();
    assert.equal(await page.getByRole('button', { name: 'Create reflection', exact: true }).isDisabled(), true);
    assert.match(await page.locator('.ts-connection-note').innerText(), /not connected/);
    assert.equal(new URL(page.url()).origin, 'http://127.0.0.1:4176');
    await screenshot('production-report-unavailable');
    assert.equal(apiRequests.length, 0);
  });
  await check('no uncaught browser errors or application API calls', async () => {
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(apiRequests, []);
  });
} catch (error) {
  console.error(error);
  if (page && !page.isClosed()) await screenshot('failure').catch(() => {});
  process.exitCode = 1;
} finally {
  await writeFile(join(directory, 'results.json'), JSON.stringify({ results, screenshots, pageErrors, apiRequests, note: 'Automated Chromium checks and captured screenshots. These are not a human visual or screen-reader review.' }, null, 2));
  if (browser) await browser.close();
  if (devServer) await devServer.close();
  if (productionServer) await new Promise(resolveClose => productionServer.httpServer.close(resolveClose));
  if (buildDirectory) await rm(buildDirectory, { recursive: true, force: true });
}
