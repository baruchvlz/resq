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

The functions return an object similar to:

```json
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
            children: [],
        }
    ]
}
```

* [Basic Usage]()
* [Async selection]()
* [Styled Components & MaterialUI]()
* [Filtering selection]()
* [Selecting React.Fragments]()
* [resq$ vs resq$$]()

#### Basic Usage

#### Async selection

#### Styled Components & MaterialUI

#### Filtering selection

#### Selecting React.Fragment

#### resq$ vs resq$$
