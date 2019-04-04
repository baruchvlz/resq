# resq (REact Selector Query) ![npm](https://img.shields.io/npm/v/resq.svg) [![Build Status](https://travis-ci.org/baruchvlz/resq.svg?branch=master)](https://travis-ci.org/baruchvlz/resq) [![codecov](https://codecov.io/gh/baruchvlz/resq/branch/master/graph/badge.svg)](https://codecov.io/gh/baruchvlz/resq)

## Requirements

- React v16 or higher
- Node 8 or higher

This library tries to implement something similar to `querySelector` and `querySelectorAll`, but through the React VirtualDOM. You can query for React composite elements or HTML elements.

Though the main use of this library is for E2E testing, it can be used in any almost any scenario

## Example

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { waitToLoadReact, resq$, resq$$ } from "resq";

(async () => {
  try {
    await waitToLoadReact(2000)
    const myComponentInstance = resq$("MyComponent");
    console.log("component instance", myComponentInstance);
    /**
     * outputs:
     {
         name: 'MyComponent',
         node: null,
         isFragment: false,
         state: {},
         props: {},
         children: [
             {
                 name: 'div',
                 node: <div>MyComponent</div>
                 state: {},
                 props: {},
                 children: [
                     {
                         node: null,
                         props: 'MyComponent',
                         state: {},
                         name: null,
                         children: []
                     }
                 ],
             }
         ]
     }
     */

  } catch (error) {
    console.warn('resq error', error);
  }
})();
const MyComponent = () => (
  <div>MyComponent</div>
);

const App = () => (
  <div>
    <MyComponent />
  </div>
);

ReactDOM.render(<App />, document.querySelector("#root"));

```

## Live Example

 https://stackblitz.com/edit/resq


## Installation

```
$ npm install --save resq
```

Or

```
$ yarn add resq
```

## Usage

- Using [resq$](https://github.com/baruchvlz/resq/blob/master/docs/resq$.md) to select first instance of query
- Using [resq$$](https://github.com/baruchvlz/resq/blob/master/docs/resq$$.md) to select all matching elements in query
- Filter results with `byProps` and `byState` [doc](https://github.com/baruchvlz/resq/blob/master/docs/filtering.md)
- Understanding how to select [React.Fragments vs Wrapped JSX](https://github.com/baruchvlz/resq/blob/master/docs/selecting-fragments.md)
