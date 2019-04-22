# byProps and byState filter options

**NOTE** These two methods are available in both `resq$` and `resq$$` functions.


## byProps

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

## byState

Functionality of `byState` is the same as `byProps`, you can chain them together as well.

```js
resq$('MyComponent').byProps({ foo: 'bar' }).byState('Hello World')
```

Notice that we did not pass an object to the `byState` method. This is because the method allows for any type except functions (maybe in the future it will be added). This means that the `byState` method works as the `state` api does in React

```js
// all of these are valid arguments for byState
resq$('MyComponent').byState({ some: 'state' })
resq$('MyComponent').byState('foo')
resq$('MyComponent').byState(123)
resq$('MyComponent').byState(false)
resq$('MyComponent').byState([1, 2, 3])
```

## Methods options

As of right now, both `byProps` and `byState` have only one option: `exact`. This option will do a deep comparison of the passed argument and return only those that match the values exactly. For example:

```js

const SomeStateComp = () => {
    const [state] = useState([1, 2, 3, 4])

    return (<div> { state.map(e => <span>{e}</span> )})
    /**
     * <div>
     *      <span>1</span>
     *      <span>2</span>
     *      <span>3</span>
     *      <span>4</span>
     * </div>
     * /
}

```

Given the above component, we can select filter our selection using `byState` like so:

```js
resq$('SomeStateComp').byState([1, 2, 3]) // returns the RESQNode
resq$('SomeStateComp').byState([1, 2, 3, 4], { exact: true }) // returns the RESQNode
resq$('SomeStateComp').byState([1, 2, 3], { exact: true }) // returns []
```

Since `byProps` only accepts an object as an argument, the filtering with `exact: true` the method will only return those components in which every `key: value` pairs matches.

#### stackblitz example

https://stackblitz.com/edit/resq
