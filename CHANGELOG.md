# Changelog

## 2.0.0

Rewritten in TypeScript. The API is unchanged; see the
[migration guide](https://baruchvlz.github.io/resq/guide/migration-v1-to-v2) for the behavior changes.

### Breaking

- The browser bundle is `dist/index.global.js` (global `window.resq`). `dist/index.js` is now the ESM build.
- `resq$` and the single-result `byProps` / `byState` return `undefined` when nothing matches (v1 returned an empty object).
- `waitToLoadReact` rejects with a `ResqError` (`WAIT_TIMEOUT`) instead of the string `'Timed out'`, and resolves `undefined`.
- `global.isReactLoaded` and `global.rootReactElement` are no longer set.
- A non-DOM `element` argument throws `INVALID_ELEMENT`, an empty selector throws `INVALID_SELECTOR`, and a function filter value throws a `TypeError`.

### Added

- React 18 and 19 support, including `createRoot` detection in `waitToLoadReact`.
- Typed `ResqError` with error codes.
- Names for `memo` and `forwardRef` components; SVG elements resolve their DOM nodes.
- Documentation site, benchmarks against v1, and CI over React 16, 17, 18 and 19.

### Fixed

- `resq$$(...).map()` and `.filter()` threw.
- Chained filters on a single result ignored each other.
- Queries could read a stale fiber after a re-render.
- Duplicate results for nested scopes in descendant chains.
- Type definitions did not include `byProps` / `byState`.

### Performance

- Lazy fiber traversal that stops at the first match; 26× to 898,000× faster than v1 on the included benchmarks.
