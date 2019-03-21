## Installation

```
$ npm install --save resq
```

Or

```
$ yarn add resq
```

---

## Live Example

 https://codesandbox.io/s/m7xn1vw5m9

---
## Usage

If you want to only get the first instance use `resq$`

```javascript
import { resq$ } from 'resq'

(async () => {
    const divElements = await resq$('MyComponent div')
    /*
        outputs:
        {
            children: Array,
            name: String,
            node: HTMLElement,
            props: Object,
            state: Object
        }
    */
})()

```

If you want to get multiple instances, use `resq$$`


```javascript
import { resq$$ } from 'resq'

(async () => {
    const divElements = await resq$$('MyComponent div')
    /*
        outputs:
        [
            {
                children: Array,
                name: String,
                node: HTMLElement,
                props: Object,
                state: Object
            },
            {
                children: Array,
                name: String,
                node: HTMLElement,
                props: Object,
                state: Object
            },
            {
                children: Array,
                name: String,
                node: HTMLElement,
                props: Object,
                state: Object
            }
        ]
    */
})()

```

**Note:** For React component instances, the `node` property will be the same as the child's node, this node is the wrapper node of the component, this is due to how the Virtual DOM is rendered. Example:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { resq$ } from 'resq'

(async () => {
    try {
        const myComponentInstance = await resq$('MyComponent')
        console.log(myComponentInstance.node) // <div>MyComponent</div>
        console.log(myComponentInstance.children[0].node) // <div>MyComponent</div>
    } catch(error) {}
})()

const MyComponent = () => (
    <div>MyComponent</div>
)

const App = () => (
    <div>
        <MyComponent />
    </div>
)

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
```

---

# API

#### byProps / byState

```javascript
import { resq$ } from 'resq'

(async () => {
    // returns the first instance of <MyComponent />
    const myComponent = await resq$('MyComponent')

    // returns first instance of <MyComponent foo="bar" />
    const myComponentWithProps = await resq$('MyComponent').byProps({ foo: 'bar' })

    // Alternatively, you can also use `myComponent`
    myComponent.byProps({ foo: 'bar' })
})()
```

The `byState` API is the same as `byProps`, just the name of the method changes.
You can also chain these two methods to further your filter


```javascript
import { resq$ } from 'resq'

(async () => {
    // returns the first instance of <MyComponent />
    const myComponent = await resq$('MyComponent')

    // returns the first instance of <MyComponent foo="bar" /> with `this.state.myState = true`
    myComponent.byProps({ foo: 'bar' }).byState({ myState: true })
})()
```
