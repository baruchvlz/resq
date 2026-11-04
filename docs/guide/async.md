# Waiting for React

When your code runs before React has rendered (for example right after page load in a test), use
`waitToLoadReact`. It polls every 200 ms until it finds a React root, then remembers it so you can query
without passing an element.

```ts
import { resq$, waitToLoadReact } from 'resq'

async function getReactElement(name: string) {
  await waitToLoadReact(2000) // time to wait, in milliseconds (default 5000)

  return resq$(name)
}
```

## Finding the root

By default resq scans the document for a React root container, for both `createRoot` (React 18 and 19) and
the legacy `ReactDOM.render` (React 16 and 17). To skip the scan, pass the CSS selector of the container:

```ts
await waitToLoadReact(2000, '#root')
```

## Timeouts

When no React root appears in time, the promise rejects with a `ResqError` whose `code` is `WAIT_TIMEOUT`.

```ts
import { ResqError, waitToLoadReact } from 'resq'

try {
  await waitToLoadReact(1000)
} catch (error) {
  if (error instanceof ResqError && error.code === 'WAIT_TIMEOUT') {
    // the app never rendered
  }
}
```

## One root at a time

The remembered root is shared by the whole module, so queries without an element use the root found by
the last successful `waitToLoadReact`. If your page has several React roots, pass the element explicitly.
