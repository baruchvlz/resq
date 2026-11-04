# Migrating from v1

The API is the same: `resq$`, `resq$$`, `waitToLoadReact`, `byProps` and `byState`. v2 is a major release
because a few behaviors that were bugs or silent fallbacks now fail loudly or return honest values.

## Breaking changes

### The browser bundle moved

v1 shipped `dist/index.js` as a UMD bundle. v2 ships ESM, CommonJS and a browser build.

| Use | v1 | v2 |
| --- | --- | --- |
| Inject into a page | `resq/dist/index.js` | `resq/dist/index.global.js` |
| `import` | `resq` | `resq` (ESM) |
| `require` | `resq` | `resq` (CommonJS, `dist/index.cjs`) |

The global is still `window.resq`. Update any script that reads `node_modules/resq/dist/index.js`.

### Nothing found returns `undefined`

`resq$` and the single-result `byProps` / `byState` used to return an empty object when nothing matched. They
now return `undefined`.

```ts
// v1
resq$('Missing', root).props // undefined, silently
// v2
resq$('Missing', root)?.props
```

### Errors

| Case | v1 | v2 |
| --- | --- | --- |
| `waitToLoadReact` timeout | rejects with the string `'Timed out'` | rejects with `ResqError`, code `WAIT_TIMEOUT` |
| `waitToLoadReact` result | resolves `undefined` or `'React already loaded'` | resolves `undefined` |
| A non-DOM `element` argument | silently used the global root | throws `INVALID_ELEMENT` |
| Empty selector | returned the whole tree | throws `INVALID_SELECTOR` |
| A function passed to `byProps` / `byState` | logged a warning and returned `[]` | throws `TypeError` |

`ResqError` messages for the existing errors are unchanged.

### Globals removed

`global.isReactLoaded` and `global.rootReactElement` are no longer set. The root found by `waitToLoadReact` is
kept inside the module.

### Requirements

Node 18 or later for tooling, and React 16 to 19.

## Fixes you get for free

- `resq$$(...).map(...)` and `.filter(...)` no longer throw.
- Chained filters on a single result compose: `resq$('A')?.byProps(x)?.byState(y)` applies both. In v1 the
  second call ignored the first.
- Nested identical matches in descendant chains no longer return duplicates.
- React 18 and 19 `createRoot` containers are found by `waitToLoadReact` and by `resq$`.
- Queries read the current fiber after re-renders instead of a stale one.
- `memo` and `forwardRef` components get their names; SVG elements resolve their DOM nodes.
- `isFragment` is always a boolean, and TypeScript types are generated from the source and include `byProps`
  and `byState`.

## Things that did not change

- Selector syntax: names, `*` wildcards and space-separated descendant chains.
- Partial matching in filters, including ignoring filter keys that are absent from the target.
- Breadth-first result order.
