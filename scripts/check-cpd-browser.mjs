import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { therapistQuestions, QUIZ_VERSION, CONTEXT_ANSWER } from '../src/quiz/therapist/questions.js'

if (!process.env.PLAYWRIGHT_PACKAGE_PATH) throw new Error('Set PLAYWRIGHT_PACKAGE_PATH.')
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_PACKAGE_PATH).href)
const origin = process.env.CPD_BROWSER_ORIGIN || 'http://127.0.0.1:4173'
await mkdir('artifacts/cpd', { recursive: true })
const browser = await chromium.launch()
async function setup(mobile = false, ai = false) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 }, acceptDownloads: true, reducedMotion: mobile ? 'reduce' : 'no-preference' })
  const page = await context.newPage(), errors = [], posts = [], external = []
  page.setDefaultTimeout(12000)
  page.on('pageerror', e => errors.push(e.message))
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue()
    external.push(route.request().url()); return route.abort()
  })
  await page.route('**/api/therapist-report', route => {
    if (route.request().method() === 'GET') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ quizVersion: QUIZ_VERSION, aiAvailable: ai }) })
    posts.push(route.request().postDataJSON())
    return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"simulated failure"}' })
  })
  await page.goto(`${origin}/therapist-quiz`)
  await page.getByRole('heading', { name: 'Your therapeutic stance', exact: true }).waitFor()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Begin reflection', exact: true }).click()
  return { page, context, errors, posts, external }
}
async function expectAligned(page, index) {
  await page.waitForFunction(id => {
    const target = document.querySelector(`[data-question="${id}"]`)
    const header = document.querySelector('[data-testid="progress-header"]')
    if (!target || !header) return false
    const y = target.getBoundingClientRect().top, edge = header.getBoundingClientRect().bottom
    return y >= edge - 1 && y <= edge + 35 && Math.abs(header.getBoundingClientRect().top) <= 1
  }, therapistQuestions[index].id)
}
async function finish(page, choice = 'a', keyboard = false) {
  if (keyboard) await page.getByLabel('Scroll to the next question after selection').uncheck()
  for (let i = 0; i < 15; i++) {
    const q = therapistQuestions[i]
    const radio = page.locator(`input[name="${q.id}"][value="${choice}"]`)
    if (keyboard) {
      await radio.focus()
      const before = await page.evaluate(() => window.scrollY)
      await page.keyboard.press('Space')
      await page.waitForTimeout(350)
      assert.equal(await page.evaluate(() => window.scrollY), before, 'Keyboard selection must not move the reading position')
      assert.equal(await page.getByTestId('answered-count').innerText(), `${i + 1} answered`)
      await page.getByTestId(`continue-${q.id}`).click()
      if (i < 14) await expectAligned(page, i + 1)
    } else {
      // Exercise label taps as well as the small radio target.
      await radio.locator('..').click()
      await page.waitForFunction(n => document.querySelector('[data-testid="answered-count"]')?.textContent === `${n} answered`, i + 1)
      if (i < 14) await expectAligned(page, i + 1)
    }
  }
  if (!keyboard) {
    await page.waitForFunction(() => {
      const target = document.querySelector('.review-target')
      return target && target.getBoundingClientRect().top < window.innerHeight
    })
    await page.getByTestId('continue-button').click()
  }
  await page.getByRole('heading', { name: 'Review your choices', exact: true }).waitFor()
  assert.equal(await page.getByRole('button', { name: 'Read reflection', exact: true }).isEnabled(), true)
}
async function read(page) {
  await page.getByRole('button', { name: 'Read reflection', exact: true }).click()
  await page.getByRole('heading', { name: 'A reflection on your therapeutic stance', exact: true }).waitFor()
  assert.equal(await page.locator('.report-section').count(), 9)
  assert.equal(await page.getByRole('button', { name: 'Save to my reflection library', exact: true }).count(), 0, 'Standalone preview must not claim an account library save')
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
}
try {
  const desktop = await setup()
  await desktop.page.getByTestId('continue-q01').click()
  await desktop.page.getByText('Choose a response, or use the final option to continue.', { exact: true }).waitFor()
  await finish(desktop.page)
  await desktop.page.getByRole('button', { name: 'Change answer to Being asked for advice' }).click()
  await desktop.page.locator('input[name="q01"][value="c"]').click()
  await desktop.page.getByTestId('continue-q01').click()
  await read(desktop.page)
  const downloadPromise = desktop.page.waitForEvent('download')
  await desktop.page.getByRole('button', { name: 'Save reflection as text', exact: true }).click()
  assert.equal((await downloadPromise).suggestedFilename(), 'cpd-practice-reflection.txt')
  assert.deepEqual(desktop.errors, []); assert.deepEqual(desktop.posts, []); assert.deepEqual(desktop.external, [])
  await desktop.page.screenshot({ path: 'artifacts/cpd/desktop-reflection.png', fullPage: true })
  await desktop.context.close()
  console.log('desktop: smooth label-selection auto-scroll, sticky progress, final review, edit, report and text download passed')

  const mobile = await setup(true)
  await finish(mobile.page, CONTEXT_ANSWER)
  await read(mobile.page)
  assert.deepEqual(mobile.errors, []); assert.deepEqual(mobile.external, [])
  await mobile.page.screenshot({ path: 'artifacts/cpd/mobile-reflection.png', fullPage: true })
  await mobile.context.close()
  console.log('mobile: reduced-motion auto-scroll, sticky header and all-context completion passed')

  const keyboard = await setup(false, true)
  await finish(keyboard.page, 'b', true)
  await keyboard.page.getByRole('checkbox').check()
  await keyboard.page.getByRole('button', { name: 'Generate AI reflection', exact: true }).click()
  await keyboard.page.getByRole('alert').waitFor()
  await read(keyboard.page)
  assert.equal(keyboard.posts.length, 1); assert.deepEqual(keyboard.errors, []); assert.deepEqual(keyboard.external, [])
  await keyboard.context.close()
  console.log('keyboard: explicit Continue and local recovery after simulated AI failure passed')
} finally { await browser.close() }
