# resq (REact Selector Query) ![npm](https://img.shields.io/npm/v/resq.svg) [![Build Status](https://travis-ci.org/baruchvlz/resq.svg?branch=master)](https://travis-ci.org/baruchvlz/resq) [![codecov](https://codecov.io/gh/baruchvlz/resq/branch/master/graph/badge.svg)](https://codecov.io/gh/baruchvlz/resq)

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


#### Return object
```typescript

interface RESQNode {
    name: 'MyComponent',
    node: HTMLElement | null,
    isFragment: boolean,
    state: string | boolean | any[] | {},
    props: {},
    children: RESQNode[]
}

```

* [Basic Usage](https://github.com/baruchvlz/resq/blob/master/README.md#basic-usage)
* [Async selection](https://github.com/baruchvlz/resq/blob/readme/README.md#async-selection)
* [Styled Components & MaterialUI](https://github.com/baruchvlz/resq/blob/readme/README.md#styled-components--materialui)
* [Filtering selection](https://github.com/baruchvlz/resq/blob/readme/README.md#filtering-selection)

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

#### Async selection

Going by the same example as in [basic usage](), if you don't want to pass the root element to the function, you can do it this way:

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
