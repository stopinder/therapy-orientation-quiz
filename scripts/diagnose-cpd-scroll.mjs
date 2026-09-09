import { pathToFileURL } from 'node:url'
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_PACKAGE_PATH).href)
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message))
  await page.route('**/api/therapist-report', route => route.fulfill({ contentType: 'application/json', body: '{"aiAvailable":false}' }))
  await page.goto('http://127.0.0.1:4173/therapist-quiz')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Begin reflection', exact: true }).click()
  await page.waitForTimeout(1200)
  await page.evaluate(() => {
    window.scrollEvents = []
    for (const type of ['pointerdown', 'click', 'change']) document.addEventListener(type, e => window.scrollEvents.push({ type, detail: e.detail, target: e.target.tagName, name: e.target.name, value: e.target.value }), true)
  })
  await page.locator('input[name="q01"][value="a"]').locator('..').click()
  await page.waitForTimeout(1500)
  console.log('SCROLL DIAGNOSTIC', JSON.stringify(await page.evaluate(() => {
    const header = document.querySelector('[data-testid="progress-header"]'), target = document.querySelector('[data-question="q02"]')
    return { events: window.scrollEvents, scrollY, header: header?.getBoundingClientRect().toJSON(), target: target?.getBoundingClientRect().toJSON(), headerPosition: getComputedStyle(header).position, headerTop: getComputedStyle(header).top, margin: getComputedStyle(target).scrollMarginTop, rootHeight: document.querySelector('.cpd-reflection').clientHeight, active: document.activeElement.tagName, answerCount: document.querySelector('[data-testid="answered-count"]').textContent }
  }))))
} finally { await browser.close() }
