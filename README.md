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

 https://stackblitz.com/edit/resq-example

---
## Usage

**Important**
Before you use the library you need to make sure that React has loaded.

```javascript
// example inside a test suite

import { waitToLoadReact } from 'resq'

beforEach(async () => {
    try {
        await waitToLoadReact() // time in ms
    } catch (error) {
        // timed out
    }
})
```

The function `waitToLoadReact` takes two optional parameters `timeout` and `rootElSelector`.

- `timeout` indicates how many miliseconds should the function wait before it stops looking for the app. Defaults to `5000`
- `rootElSelector` is good for when you have multiple apps in one page. Defaults to `undefined`


If you want to only get the first instance use `resq$`

```javascript
const divElements = resq$('MyComponent div')
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

```

If you want to get multiple instances, use `resq$$`


```javascript
const divElements = resq$$('MyComponent div')
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

```

# API

#### byProps / byState

```javascript
import { resq$ } from 'resq'

// returns the first instance of <MyComponent />
const myComponent = resq$('MyComponent')

// returns first instance of <MyComponent foo="bar" />
const myComponentWithProps = resq$('MyComponent').byProps({ foo: 'bar' })

// Alternatively, you can also use `myComponent`
myComponent.byProps({ foo: 'bar' })
```

The `byState` API is the same as `byProps`, just the name of the method changes.
You can also chain these two methods to further your filter


```javascript
// returns the first instance of <MyComponent />
const myComponent = resq$('MyComponent')

// returns the first instance of <MyComponent foo="bar" /> with `this.state.myState = true`
myComponent.byProps({ foo: 'bar' }).byState({ myState: true })
```
