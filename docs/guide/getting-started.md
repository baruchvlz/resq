# Getting started

`resq` queries the React component tree the way `querySelector` queries the DOM. You select components
by their **name** and get back their props, state, children and the DOM node they rendered.

It is meant for places where the DOM is a poor handle on your UI: end-to-end tests, browser automation,
and debugging in the console.

## Install

```sh
npm install resq
```

Requirements: a browser (or jsdom) environment, and React 16 to 19. The library reads React's internal fiber
tree, so use the component names you see in React DevTools.

## A first query

```jsx
const MyComponent = () => <div>My Component</div>

const App = () => (
  <div>
    <MyComponent />
  </div>
)

createRoot(document.getElementById('root')).render(<App />)
```

```ts
import { resq$ } from 'resq'

const root = document.getElementById('root')!
const myComponent = resq$('MyComponent', root)

myComponent?.name // 'MyComponent'
myComponent?.node // <div>My Component</div>
myComponent?.props // {}
```

`resq$` returns the first match, or `undefined` when nothing matches. `resq$$` returns an array of every match.

## What a result looks like

| Field | Description |
| --- | --- |
| `name` | Component name. Host elements use their tag (`div`). |
| `props` | Props without `children`. |
| `state` | Class component state, or the first hook state of a function component. |
| `node` | Rendered DOM node, an array of nodes for fragments, or `null`. Resolved on first access. |
| `isFragment` | `true` when the component renders several sibling nodes. |
| `children` | Child results. Resolved on first access. |
| `byProps()` / `byState()` | [Filters](./filtering). |

## Next steps

- [Selecting components](./selecting): names, wildcards, descendant chains.
- [Filtering by props and state](./filtering).
- [Waiting for React](./async) when the page is still loading.
- [Using with automation tools](./automation-tools) such as WebdriverIO, Puppeteer, Playwright and Cypress.
