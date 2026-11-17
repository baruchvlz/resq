# Filtering by props and state

Results have `byProps` and `byState` to narrow a selection.

```jsx
const MyComponent = ({ someBooleanProp }) => (
  <div>My Component {someBooleanProp ? 'show this' : ''}</div>
)

const App = () => (
  <div>
    <MyComponent />
    <MyComponent someBooleanProp={true} />
  </div>
)
```

## On a single result

`resq$` finds the first match. Calling `byProps` on it filters among **all** matches of the query and
returns the first that fits, or `undefined`.

```ts
const enabled = resq$('MyComponent', root)?.byProps({ someBooleanProp: true })

enabled?.props // { someBooleanProp: true }
```

Filters compose, because each returned node keeps the narrowed candidates:

```ts
resq$('Button', root)?.byProps({ primary: true })?.byState({ loading: false })
```

## On multiple results

`resq$$` returns an array with `byProps` and `byState` that return arrays, so you can chain them.

```ts
resq$$('MyComponent', root).byProps({ someBooleanProp: true }).byState({ open: true })
```

The array methods `map`, `filter` and `slice` return plain arrays.

## How matching works

By default the filter is a **partial** match:

- Primitive values must be strictly equal.
- Nested objects are matched recursively with the same rules.
- Arrays match when they share at least one item.
- Keys that exist in the filter but not in the target are ignored, as long as at least one key is shared.

Pass `{ exact: true }` for deep equality instead:

```ts
resq$$('Item', root).byProps({ id: 1 }, { exact: true }) // props must be exactly { id: 1 }
```

Non-object state works too: `byState('open')`, `byState(true)` and `byState([1, 2, 3])`.

::: warning
Functions are not supported as filter values. Passing one throws a `TypeError`.
:::

## Where state comes from

For class components `state` is the component state. For function components using hooks it is the state of
the **first** hook. Components without state have `state: undefined`.
