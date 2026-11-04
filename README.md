# resq (React Element Selector Query)

[![npm](https://img.shields.io/npm/v/resq.svg)](https://www.npmjs.com/package/resq)
[![CI](https://github.com/baruchvlz/resq/actions/workflows/ci.yml/badge.svg)](https://github.com/baruchvlz/resq/actions/workflows/ci.yml)

`querySelector` for the React tree. Find components by name, then read their props, state and DOM nodes.
Built for end-to-end tests, browser automation and debugging.

**Documentation: <https://baruchvlz.github.io/resq/>**

- React 16 to 19 (`ReactDOM.render` and `createRoot`)
- Written in TypeScript, ships ESM, CommonJS and a browser bundle
- Wildcards (`My*`), descendant chains (`Form Field input`), filtering by props and state

## Install

```sh
npm install resq
```

## Usage

```ts
import { resq$, resq$$, waitToLoadReact } from 'resq'

const root = document.getElementById('root')!

resq$('MyComponent', root) // first match, or undefined
resq$$('My*', root) // every match

resq$('Button', root)?.byProps({ primary: true })?.props // filter by props or state

await waitToLoadReact(2000) // wait for React, then query without an element
resq$('MyComponent')
```

Each result has `name`, `props`, `state`, `node`, `isFragment`, `children`, `byProps()` and `byState()`.

## Migrating from v1

v2 keeps the API but changes a few behaviors (not-found returns `undefined`, errors are typed, the browser
bundle is `dist/index.global.js`). See the [migration guide](https://baruchvlz.github.io/resq/guide/migration-v1-to-v2).

## Development

```sh
npm ci
npm test            # unit and integration tests with coverage
npm run lint
npm run typecheck
npm run build
npm run bench       # compare against the v1 implementation
npm run docs:dev    # documentation site
```

Tests run against the installed React version. To try another one:
`npm install --no-save --legacy-peer-deps react@17 react-dom@17 && npm test`.

## License

MIT
