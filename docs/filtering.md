# byProps and byState filter options

**NOTE** These two methods are available in both `resq$` and `resq$$` functions.

This doc only shows an example for `byProps`, but using `byState` is basically the same functionality just a different object to search.

## Usage

```javascript
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

function MyComponent (props) {
    return (
        <div>
            Hello from MyComponent
            {
                props.showNested ?
                    <div>
                        Another div
                    </div>
                : null
            }
        </div>
    )
}

function App() {
    return (
        <div>
            <MyComponent />
            <MyComponent showNested={true} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))

```

In order to pick the `MyComponent` instance that has the prop `showNested` set to true, we can filter the query using the `byProps` method

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

    const filtered = resq.byProps({ showNested: true })

    // this can also be done like so:
    // const filtered = resq$('MyComponent').byProps({ showNested: true })

    expect(filtered).toMatchObject({
        name: 'MyComponent',
        node: null,
        props: { showNested: true },
        state: {},
        children: [{}]
        isFragment: false
    })
})

```

#### stackblitz example

https://stackblitz.com/edit/resq-fragment
