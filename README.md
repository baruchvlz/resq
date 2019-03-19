## Installation

```shell
npm install --save resq
```

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
            node: FiberNode || HTMLElement,
            props: Object,
            state: Object
        }
    */
})()

```

If you want to get multiple instances, use `resq$$`


```javascript
import { resq$$ } from 'resq$'

(async () => {
    const divElements = await resq$$('MyComponent div')
    /*
        outputs:
        [
            {
                children: Array,
                name: String,
                node: FiberNode || HTMLElement,
                props: Object,
                state: Object
            },
            {
                children: Array,
                name: String,
                node: FiberNode || HTMLElement,
                props: Object,
                state: Object
            },
            {
                children: Array,
                name: String,
                node: FiberNode || HTMLElement,
                props: Object,
                state: Object
            }
        ]
    */
})()

```

## API

Both `resq$` and `resq$$` provide an API to search `byProps` and/or `byState`.

```javascript
import { resq$$ } from 'resq$'

(async () => {
    const myComponent = await resq$('MyComponent') // returns the first instance of <MyComponent />

    const myComponentWithProps = await resq$('MyComponent').byProps({ foo: 'bar' })
    // returns first instance of MyComponent with at least `foo: bar` as props

    // You can also use `myComponent`
    myComponent.byProps({ foo: 'bar' })
})()
```
