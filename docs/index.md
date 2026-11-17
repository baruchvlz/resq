---
layout: home

hero:
  name: resq
  text: React Element Selector Query
  tagline: querySelector for the React tree. Find components by name, then read their props, state and DOM nodes.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: API reference
      link: /api/
    - theme: alt
      text: Migrating from v1
      link: /guide/migration-v1-to-v2

features:
  - title: Select by component name
    details: Query components with wildcards and descendant chains, even when the DOM has no useful selectors (styled and generated class names).
  - title: Props, state and DOM nodes
    details: Every match exposes its props, state, children and the DOM node it rendered. Filter with byProps and byState.
  - title: React 16 to 19
    details: Works with legacy roots, createRoot, hooks, class components, memo and forwardRef.
  - title: Fast on large trees
    details: Lazy traversal that stops at the first match. Orders of magnitude faster than v1 on big applications.
  - title: Written in TypeScript
    details: Typed API, ESM, CommonJS and a ready-to-inject browser bundle.
---
