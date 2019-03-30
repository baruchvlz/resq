# resq$(selector: string) => ReactSelectorQueryNode

This function is used to pick the first element in the tree that matches the passed selector.

## Usage

```javascript
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

function MyComponent (props) {
    return (
        <div>
            Hello from MyComponent
        </div>
    )
}

ReactDOM.render(<MyComponent />, document.getElementById('root'))

```

Example test:

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
        name: 'MyComponent',
        node: null,
        children: [{}]
        isFragment: false
    })
})

```

#### stackblitz example

https://stackblitz.com/edit/resq-single
