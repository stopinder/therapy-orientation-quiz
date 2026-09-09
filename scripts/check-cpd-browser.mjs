import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { therapistQuestions, QUIZ_VERSION, CONTEXT_ANSWER } from '../src/quiz/therapist/questions.js'
import { reactive, computed } from 'vue'

// The CI-only package is installed outside the app. No runtime dependency or lockfile change.
const packagePath = process.env.PLAYWRIGHT_PACKAGE_PATH
if (!packagePath) throw new Error('Set PLAYWRIGHT_PACKAGE_PATH to the installed playwright/index.mjs file.')
const { chromium } = await import(pathToFileURL(packagePath).href)
const origin = process.env.CPD_BROWSER_ORIGIN || 'http://127.0.0.1:4173'
await mkdir('artifacts/cpd', { recursive: true })

// Reproduce the original completion calculation with the locked Vue version.
const legacyAnswers = reactive({})
const legacyCount = computed(() => therapistQuestions.filter(q => Object.hasOwn(legacyAnswers, q.id)).length)
assert.equal(legacyCount.value, 0)
legacyAnswers.q01 = 'a'
console.log(`Original Object.hasOwn counter after first answer: ${legacyCount.value}; expected 1. The updated UI uses tracked value reads.`)

const browser = await chromium.launch()
const results = []

async function makePage(viewport, service) {
  const context = await browser.newContext({ viewport, acceptDownloads: true })
  const page = await context.newPage()
  page.setDefaultTimeout(12000)
  const errors = []
  const posts = []
  const unexpectedRequests = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/*', route => {
    const url = new URL(route.request().url())
    if (url.origin !== origin) { unexpectedRequests.push(url.origin); return route.abort() }
    return route.continue()
  })
  await page.route('**/api/therapist-report', async route => {
    if (route.request().method() === 'GET') {
      if (service === 'offline') return route.abort()
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ quizVersion: QUIZ_VERSION, aiAvailable: service === 'ai-fails' }) })
    }
    posts.push(route.request().postDataJSON())
    return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Simulated provider unavailability' }) })
  })
  await page.goto(`${origin}/therapist-quiz`)
  await page.getByRole('heading', { name: 'Your therapeutic stance', exact: true }).waitFor()
  assert.equal(await page.title(), 'CPD · Practice reflection')
  assert.equal((await page.locator('body').innerText()).includes('MindWorks'), false)
  return { context, page, errors, posts, unexpectedRequests }
}
async function begin(page) {
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Begin reflection' }).click()
  await page.getByText('Situation 1 of 15', { exact: true }).waitFor()
}
async function complete(page, choice = 'a', keyboard = false) {
  for (let index = 0; index < therapistQuestions.length; index += 1) {
    const question = therapistQuestions[index]
    await page.getByText(`Situation ${index + 1} of 15`, { exact: true }).waitFor()
    const radio = page.locator(`input[name="${question.id}"][value="${choice}"]`)
    if (keyboard) { await radio.focus(); await page.keyboard.press('Space') } else await radio.check()
    await page.getByText(`${index + 1} answered`, { exact: true }).waitFor()
    const next = page.getByTestId('continue-button')
    assert.equal(await next.isEnabled(), true)
    if (keyboard) { await next.focus(); await page.keyboard.press('Enter') } else await next.click()
  }
  await page.getByRole('heading', { name: 'Review your choices', exact: true }).waitFor()
  assert.equal(await page.getByRole('button', { name: 'Read reflection', exact: true }).isEnabled(), true)
}
async function readReflection(page) {
  await page.getByRole('button', { name: 'Read reflection', exact: true }).click()
  await page.getByRole('heading', { name: 'A reflection on your therapeutic stance', exact: true }).waitFor()
  assert.equal(await page.locator('.report-section').count(), 9)
  assert.match(await page.locator('.report-label').innerText(), /not AI-generated/)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
}
function luminance(rgb) {
  const channels = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(x => {
    const c = x / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}
function contrast(a, b) { const x = luminance(a); const y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05) }

try {
  for (const scenario of [
    { name: 'desktop', viewport: { width: 1280, height: 900 }, service: 'disabled', choice: 'a', keyboard: false },
    { name: 'mobile-context', viewport: { width: 390, height: 844 }, service: 'offline', choice: CONTEXT_ANSWER, keyboard: true },
    { name: 'ai-failure', viewport: { width: 1024, height: 800 }, service: 'ai-fails', choice: 'b', keyboard: false }
  ]) {
    const run = await makePage(scenario.viewport, scenario.service)
    const { page } = run
    try {
      const colours = await page.evaluate(() => {
        const root = getComputedStyle(document.querySelector('.cpd-reflection'))
        return { canvas: root.backgroundColor, text: root.color }
      })
      assert.equal(colours.canvas, 'rgb(244, 240, 231)')
      assert.ok(contrast(colours.text, colours.canvas) >= 4.5)
      await begin(page)
      if (scenario.name === 'desktop') {
        await page.getByTestId('continue-button').click()
        await page.getByText('Choose a response, or select “I cannot choose a usual response” to continue.', { exact: true }).waitFor()
        await page.getByText('Situation 1 of 15', { exact: true }).waitFor()
        await page.screenshot({ path: 'artifacts/cpd/desktop-question.png', fullPage: true })
      }
      await complete(page, scenario.choice, scenario.keyboard)
      if (scenario.name === 'ai-failure') {
        const ai = page.getByRole('button', { name: 'Generate AI reflection', exact: true })
        assert.equal(await ai.isDisabled(), true)
        await page.locator('.ai-option').getByRole('checkbox').check()
        await ai.click()
        await page.getByRole('alert').waitFor()
        assert.equal(run.posts.length, 1)
        assert.deepEqual(Object.keys(run.posts[0]).sort(), ['answers', 'consent', 'quizVersion'])
        assert.equal(Object.keys(run.posts[0].answers).length, 15)
        assert.equal(await page.getByRole('button', { name: 'Read reflection', exact: true }).isEnabled(), true)
      }
      const buttonColours = await page.getByRole('button', { name: 'Read reflection', exact: true }).evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, fg: getComputedStyle(el).color }))
      assert.equal(buttonColours.bg, 'rgb(29, 84, 109)')
      assert.ok(contrast(buttonColours.bg, buttonColours.fg) >= 4.5)
      await readReflection(page)
      if (scenario.choice === CONTEXT_ANSWER) assert.match(await page.locator('.report').innerText(), /not enough evidence/)
      await page.screenshot({ path: `artifacts/cpd/${scenario.name}-reflection.png`, fullPage: true })
      if (scenario.name === 'desktop') {
        await page.getByRole('button', { name: 'Review my choices', exact: true }).click()
        await page.getByRole('button', { name: 'Change answer to Being asked for advice', exact: true }).click()
        await page.locator('input[name="q01"][value="b"]').check()
        await page.getByTestId('continue-button').click()
        await page.getByRole('heading', { name: 'Review your choices', exact: true }).waitFor()
        assert.match(await page.locator('.review-row').first().innerText(), /Invite the client to explore/)
        await readReflection(page)
        const pending = page.waitForEvent('download')
        await page.getByRole('button', { name: 'Save reflection as text', exact: true }).click()
        const download = await pending
        assert.equal(download.suggestedFilename(), 'cpd-practice-reflection.txt')
        if (await download.failure()) throw new Error('Text export failed')
      }
      assert.deepEqual(run.errors, [])
      assert.deepEqual(run.unexpectedRequests, [])
      if (scenario.service !== 'ai-fails') assert.equal(run.posts.length, 0)
      results.push(`${scenario.name}: all 15 questions, completion, reflection and layout passed`)
    } catch (error) {
      await page.screenshot({ path: `artifacts/cpd/${scenario.name}-failure.png`, fullPage: true }).catch(() => {})
      throw error
    } finally { await run.context.close() }
  }
  console.log(results.join('\n'))
} finally { await browser.close() }
