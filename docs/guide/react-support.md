# React version support

resq v2 is tested against real renders of **React 16.14, 17.0, 18.3 and 19.3** on every change.

| React | Root API | Supported |
| --- | --- | --- |
| 16 | `ReactDOM.render` | Yes |
| 17 | `ReactDOM.render` | Yes |
| 18 | `createRoot` | Yes |
| 19 | `createRoot` | Yes |

Covered in each version: function and class components, hooks state, fragments, `memo`, `forwardRef`,
higher-order components, wildcard and descendant selectors, and re-rendered trees.

## How React is read

resq does not depend on React's types or runtime. It reads the internal fiber tree through the keys React
stores on DOM elements:

| Key | Set by |
| --- | --- |
| `_reactRootContainer` | `ReactDOM.render` (React 16 and 17) |
| `__reactContainer$…` | `createRoot` (React 18 and 19) |
| `__reactFiber$…` | Any rendered element (React 17 and later) |
| `__reactInternalInstance$…` | Any rendered element (React 16) |

When several keys are present, container keys win over element keys.

React keeps two versions of each fiber and swaps them on every update, but only stores one on the DOM node.
resq finds whichever one is in the current tree, so you always read up-to-date props and state, even after
re-renders. An element React already unmounted raises `REACT_INSTANCE_NOT_FOUND`.

::: warning Internal APIs
Fibers are an implementation detail of React. They have been stable across 16 to 19, but a future React
release can change them. The test matrix is there to catch it.
:::
