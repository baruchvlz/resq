# resq (React Element Selector Query) ![npm](https://img.shields.io/npm/v/resq.svg) [![Build Status](https://travis-ci.org/baruchvlz/resq.svg?branch=master)](https://travis-ci.org/baruchvlz/resq) [![codecov](https://codecov.io/gh/baruchvlz/resq/branch/master/graph/badge.svg)](https://codecov.io/gh/baruchvlz/resq)

## Requirements

- React v16 or higher
- Node 8 or higher
- React DevTools (optional)

This library tries to implement something similar to `querySelector` and `querySelectorAll`, but through the React VirtualDOM. You can query for React composite elements or HTML elements. It provides two functions `resq$` and `resq$$` for selecting one or multiple components, respectively.

## Installation

```
$ npm install --save resq

$ yarn add resq
```

## Usage

To get the most out of the library, we recommend you use React Dev Tools to verify the component names you want to select. Granted for basic usage you don't need this as long as you know the component name beforehand, but for Styled components and MaterialUI components it will be of great help.


#### Type definition
```typescript

interface RESQNode {
    name: 'MyComponent',
    node: HTMLElement | null,
    isFragment: boolean,
    state: string | boolean | any[] | {},
    props: {},
    children: RESQNode[]
}

resq$(selector: string, element?: HTMLElement): RESQNode
resq$$(selector: string, element?: HTMLElement): Array<RESQNode>

```

* [Basic Usage](README.md#basic-usage)
* [Wildcard selection](README.md#wildcard-selection)
* [Async selection](README.md#async-selection)
* [Styled Components & MaterialUI](README.md#styled-components--materialui)
* [Filtering selection](README.md#filtering-selection)

#### Basic Usage
Take this React App:

```jsx
// imports

const MyComponent = () => (
    <div>My Component</div>
)

const App = () => (
    <div><MyComponent /></div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

Selecting `MyComponent`:

```js
import { resq$ } from 'resq'

const root = document.getElementById('root');
resq$('MyComponent', root);
/*
{
    name: 'MyComponent',
    node: <div />,
    isFragment: false,
    state: {},
    props: {},
    children: []
}
*/
```

#### Wildcard selection

You can select your components by partial name use a wildcard selectors:

```jsx
// imports

const MyComponent = () => (
    <div>My Component</div>
)

const MyAnotherComponent = () => (
    <div>My Another Component</div>
)

const App = () => (
    <div>
        <MyComponent />
        <MyAnotherComponent />
    </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

Selecting both components by wildcard:
```js
import { resq$$ } from 'resq'

const root = document.getElementById('root');
resq$$('My*', root);
/*
[
    {
        name: 'MyComponent',
        node: <div />,
        isFragment: false,
        state: {},
        props: {},
        children: []
    },
    {
        name: 'MyAnotherComponent',
        node: <div />,
        isFragment: false,
        state: {},
        props: {},
        children: []
    },
]
*/
```

Selecting `MyAnotherComponent` by wildcard:
```js
import { resq$ } from 'resq'

const root = document.getElementById('root');
resq$('My*Component', root);
/*
{
    name: 'MyAnotherComponent',
    node: <div />,
    isFragment: false,
    state: {},
    props: {},
    children: []
}
*/
```

#### Async selection

Going by the same example as in [basic usage](README.md#basic-usage), if you don't want to pass the root element to the function, you can do it this way:

```js
import { resq$, waitToLoadReact } from 'resq'

async function getReactElement(name) {
    try {
        await waitToLoadReact(2000) // time in MS to wait before erroring

        return resq$(name)
    } catch (error) {
        console.warn('resq error', error)
    }
}

getReactElement('MyComponent')
```

#### Styled Components & MaterialUI
For selecting Styled components or MaterialUI components, we **strongly** recommend you use React DevTools to see the component structure in your browser in order to more easily understand the name of the components once the libraries compile them.

Example app:

```jsx
// imports
const App = () => (
  <Container>
      <Paper>
          <Box component="span">
            <Link>tick</Link>
          </Box>
      </Paper>
    </Container>
)

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App/>
  </ThemeProvider>,
  document.querySelector('#root')
)
```

To select the `Box` component:

```js
import { resq$ } from 'resq'

resq$('Styled(MuiBox)', document.querySelector('#root'))
```
#### Filtering selection

You can filter your selections `byState` or `byProps`. These are methods attached to the RESQNode return objects.

Example app:
```jsx
// imports

const MyComponent = ({ someBooleanProp }) => (
    <div>My Component {someBooleanProp ? 'show this' : ''} </div>
)

const App = () => (
    <div>
        <MyComponent />
        <MyComponent someBooleanProp={true} />
    </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

To select the first instance of `MyComponent` where `someBooleanProp` is true:

```js
import { resq$ } from 'resq'

const root = document.getElementById('root')
const myComponent = resq$('MyComponent', root)
const filtered = myComponent.byProps({ someBooleanProp: true })

console.log(filtered)
/*
{
    name: 'MyComponent',
    node: <div />,
    isFragment: false,
    state: {},
    props: {
        someBooleanProp: true,
    },
    children: []
}
*/

```
