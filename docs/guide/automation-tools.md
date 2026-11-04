# Using with automation tools

Browser automation tools run your test code in Node, but resq has to run **inside the page**. Inject the
browser bundle, `dist/index.global.js`, then call the `window.resq` global from the page context.

The bundle exposes the same functions as the module: `window.resq.resq$`, `window.resq.resq$$` and
`window.resq.waitToLoadReact`.

## Puppeteer

```ts
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const resqBundle = readFileSync(createRequire(import.meta.url).resolve('resq/dist/index.global.js'), 'utf8')

await page.evaluate(resqBundle)

const buttonLabel = await page.evaluate(async () => {
  await window.resq.waitToLoadReact(5000)

  return window.resq.resq$('Button')?.props.label
})
```

## Playwright

```ts
await page.addInitScript({ path: require.resolve('resq/dist/index.global.js') })

const label = await page.evaluate(async () => {
  await window.resq.waitToLoadReact(5000)

  return window.resq.resq$('Button')?.props.label
})
```

## WebdriverIO and Selenium

Load the bundle once with `browser.execute`, then query in later calls:

```ts
const resqBundle = readFileSync(require.resolve('resq/dist/index.global.js'), 'utf8')

await browser.execute(resqBundle)

const label = await browser.executeAsync((done) => {
  window.resq.waitToLoadReact(5000).then(() => done(window.resq.resq$('Button')?.props.label))
})
```

## Cypress

Cypress runs in the page's origin, so import the package in your support file or tests and pass the
`window` document's root element:

```ts
import { resq$ } from 'resq'

cy.get('#root').then(($root) => {
  expect(resq$('Button', $root[0])?.props.label).to.equal('Save')
})
```

## Returning results to the test

Results hold DOM nodes and lazy getters, so they cannot be sent back from the page as they are. Return plain
values (props, state, text) from the function you run in the page, as in the examples above.
