# resq$$(selector: string) => Array<ReactSelectorQueryNode>

This function is used to all the elements that match the query

## Usage

```javascript
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

function MyComponent (props) {
    return (
        <div>
            Hello from MyComponent
            <div>
                Another div
            </div>
        </div>
    )
}

ReactDOM.render(<MyComponent />, document.getElementById('root'))

```

Example test:

```javascript
// index.test.js
import { waitToLoadReact, resq$$ } from 'resq'

beforeEach(async () => {
    try {
        await waitToLoadReact(2000) // 2s
    } catch (error) {
        throw error
    }
})

test('MyComponent:', () => {
    const resq = resq$$('MyComponent div')

    expect(resq).toMatchObject([
        {
            node: <div>Hello from MyComponent <div>Another div</div> </div>,
            state: {},
            props: {},
            chlidren: [{}] // <div>Another div</div> resq instance,
            name: 'div'
        },
        {
            node:<div>Another div</div>,
            state: {},
            props: {},
            chlidren: []
            name: 'div'
        }
    ])
})

```
