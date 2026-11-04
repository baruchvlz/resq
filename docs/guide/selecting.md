# Selecting components

A selector is one or more component names separated by spaces. Names are matched against the whole
component name, case-sensitively.

```ts
resq$('MyComponent', root) // exact name
resq$$('div', root) // host elements match by tag name
```

## Wildcards

`*` matches one or more characters.

```ts
resq$$('My*', root) // MyComponent, MyAnotherComponent
resq$('My*Component', root) // first match of MyComponent, MyAnotherComponent
resq$$('*Button', root) // PrimaryButton, IconButton, ...
```

## Descendant chains

Separate names with spaces to search below the previous match, like the CSS descendant combinator. Each
segment can use wildcards.

```ts
resq$$('Form Field input', root) // every input inside a Field inside a Form
```

Results come back in breadth-first order (the shallowest matches first), without duplicates.

## Higher-order components

Wrapper names such as `connect(withRouter(Foo))` are matched by their innermost name, so you query `Foo`.
The result keeps the full wrapper name in `name`.

```ts
resq$$('Foo', root).map(node => node.name) // ['connect(withRouter(Foo))', 'Foo']
```

## memo, forwardRef and styled components

`memo` and `forwardRef` components resolve to the name of the component they wrap, or their `displayName`
when set. Libraries that set `displayName` (such as styled-components) work with their display name:

```ts
resq$('styled.button', root)
```

## Choosing the starting point

Pass the DOM element to search from as the second argument. Without it, resq uses the root remembered by
[`waitToLoadReact`](./async).

```ts
resq$('Item', document.querySelector('#sidebar')!)
```

The element can be a React root container or any element rendered by React. Components are searched below it.

## Not found

`resq$` returns `undefined` when nothing matches and `resq$$` returns an empty array. Invalid input throws a
[`ResqError`](/api/classes/ResqError):

| Code | When |
| --- | --- |
| `INVALID_SELECTOR` | The selector is not a string or is empty. |
| `ROOT_NOT_LOADED` | No element was given and `waitToLoadReact` has not found a root. |
| `INVALID_ELEMENT` | The given element is not a DOM element. |
| `REACT_INSTANCE_NOT_FOUND` | React did not render the given element, or it was unmounted. |
