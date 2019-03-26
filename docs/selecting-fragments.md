# Fragments vs Wrapped JSX

There are two ways of wrapping JSX in React components.

One way is to use a HTMLElement like so:

```javascript
const MyComponent = () => (
    <div>
        <div>Hello World</div>
    </div>
)
```

And another way to wrap them is with [React.Fragment](https://reactjs.org/docs/fragments.html)

```javascript
const MyComponent = () => (
    <React.Fragment>
        <div>Hello World</div>
    <React.Fragment>
)
```

It is important to know the difference between these two functionalities as it affects the way the library returns the queried elements.

### Usage with React.Fragment

```javascript
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

function MyComponent (props) {
    return (
        <React.Fragment>
            Hello from MyComponent
            <div>
                Another div
            </div>
        </React.Fragment>
    )
}

ReactDOM.render(<MyComponent />, document.getElementById('root'))
```

Example test selecting nested div:

```javascript
// index.test.js
import { waitToLoadReact, resq$ } from 'resq'

beforeEach(async () => {
    try {
        await waitToLoadReact(2000) // 2s
    } catch (error) {
        throw error
    }
})

test('MyComponent:', () => {
    const resq = resq$('MyComponent div')

    expect(resq).toMatchObject({
        node:<div>Another div</div>,
        state: {},
        props: {},
        chlidren: []
        name: 'div'
    })
})
```

Example test selecting React component:

```javascript
// index.test.js
import { waitToLoadReact, resq$ } from 'resq'

beforeEach(async () => {
    try {
        await waitToLoadReact(2000) // 2s
    } catch (error) {
        throw error
    }
})

test('MyComponent:', () => {
    const resq = resq$('MyComponent')

    expect(resq).toMatchObject({
        node: null,
        state: {},
        props: {},
        chlidren: [{}, {}] // 1) Hello from MyComponent 2)<div>Another div</div>
        name: 'MyComponent'
    })
})
```
