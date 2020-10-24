export const vdom = {
    type: undefined,
    child: {
        type: function TestWrapper() {},
        memoizedProps: {
            myProps: 'test prop',
        },
        memoizedState: {
            baseState: {
                initialized: true,
            },
        },
        child: {
            type: 'div',
            memoizedProps: {},
            memoizedState: {},
            stateNode: document.createElement('div'),
            child: {
                type: 'span',
                memoizedProps: {
                    testProp: 'some prop',
                },
                memoizedState: {},
                stateNode: document.createElement('span'),
                sibling: {
                    type: 'span',
                    memoizedProps: {
                        testProp: 'some prop',
                        children: [{}],
                    },
                    memoizedState: { testState: true },
                    stateNode: document.createElement('span'),
                    sibling: {
                        type: 'div',
                        memoizedProps: {},
                        memoizedState: { testState: true, otherState: 'foo' },
                        stateNode: document.createElement('div'),
                        sibling: {
                            type: undefined,
                            memoizedProps: 'Foo bar',
                            memoizedState: { testState: true },
                            stateNode: null,
                        },
                    },
                },
            },
        },
    },
}

export const tree = {
    name: undefined,
    children: [
        {
            name: 'TestWrapper',
            props: { myProps: 'test prop' },
            state: { initialized: true },
            children: [
                {
                    name: 'div',
                    props: {},
                    state: {},
                    node: document.createElement('div'),
                    children: [
                        {
                            name: 'span',
                            props: { testProp: 'some prop' },
                            state: {},
                            node: document.createElement('span'),
                            children: [],
                        },
                        {
                            name: 'span',
                            props: { testProp: 'some prop' },
                            state: { testState: true },
                            node: document.createElement('span'),
                            children: [],
                        },
                        {
                            name: 'div',
                            props: { },
                            state: { testState: true, otherState: 'foo' },
                            node: document.createElement('div'),
                            children: [],
                        },
                        {
                            name: undefined,
                            props: 'Foo bar',
                            state: { testState: true },
                            node: document.createTextNode('Foo bar'),
                            children: [],
                        },
                    ],
                },
            ],
            node: document.createElement('div'),
        },
    ],
    props: undefined,
    state: {},
    node: null,
}

export const treeForWildcards = {
    name: undefined,
    children: [
        {
            name: 'TestWrapper',
            props: { myProps: 'test prop' },
            state: { initialized: true },
            children: [
                {
                    name: 'TestName',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('span'),
                    children: [],
                },
                {
                    name: 'TestName-2',
                    props: { testProp: 'some prop 1' },
                    state: {},
                    node: document.createElement('span'),
                    children: [],
                },
                {
                    name: 'NameTest',
                    props: { testProp: 'some prop 2' },
                    state: { testState: true },
                    node: document.createElement('span'),
                    children: [],
                },
                {
                    name: 'Nested',
                    props: { testProp: 'some prop 3' },
                    state: { },
                    node: document.createElement('div'),
                    children: [
                        {
                            name: 'div',
                            props: { testProp: 'some prop 4' },
                            node: document.createElement('div'),
                        },
                    ],
                },
            ],
            node: document.createElement('div'),
        },
    ],
    props: undefined,
    state: {},
    node: null,
}

export const treeWithStyledComponents = {
    name: undefined,
    children: [
        {
            name: 'TestWrapper',
            props: { myProps: 'test prop' },
            state: { initialized: true },
            children: [
                {
                    name: {
                        componentStyle: {
                            rules: [],
                            isStatic: false,
                            componentId: 'styled__Button-sc-1fuu6r1-1',
                        },
                        displayName: 'styled__Button',
                        styledComponentId: 'styled__Button-sc-1fuu6r1-1',
                    },
                    props: { testProp: 'some prop' },
                    state: {},
                    node: null,
                    children: [
                        {
                            name: 'button',
                            props: {},
                            state: {},
                            node: document.createElement('button'),
                            children: [],
                        },
                    ],
                },
                {
                    name: {
                        componentStyle: {
                            rules: [],
                            isStatic: false,
                            componentId: 'styled__Div-sc-1fuu6r1-1',
                        },
                        displayName: 'styled__Div',
                        styledComponentId: 'styled__Div-sc-1fuu6r1-1',
                    },
                    props: { testProp: 'another prop' },
                    state: {},
                    node: null,
                    children: [
                        {
                            name: 'wrapper',
                            props: {},
                            state: {},
                            node: null,
                            children: [
                                {
                                    name: 'div',
                                    props: {},
                                    state: {},
                                    node: document.createElement('div'),
                                    children: [
                                        {
                                            name: 'MyButton',
                                            props: {someProp: 'some prop value'},
                                            state: {},
                                            node: document.createElement('button'),
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            node: document.createElement('div'),
        },
    ],
    props: undefined,
    state: {},
    node: null,
}

export const fragmentVDOM = {
    type: undefined,
    child: {
        type: function FragmentComponent() {},
        child: {
            type: 'div',
            memoizedProps: {},
            memoizedState: {},
            stateNode: document.createElement('div'),
            sibling: {
                type: 'span',
                memoizedProps: {
                    testProp: 'some prop',
                },
                memoizedState: {},
                stateNode: document.createElement('span'),
                sibling: {
                    type: 'span',
                    memoizedProps: {
                        testProp: 'some prop',
                        children: [{}],
                    },
                    memoizedState: { testState: true },
                    stateNode: document.createElement('span'),
                    sibling: {
                        type: undefined,
                        memoizedProps: {},
                        children: [{}],
                        stateNode: document.createTextNode('text'),
                        sibling: {
                            type: function NestedFragmentComponent() {},
                            child: {
                                type: 'div',
                                memoizedProps: {},
                                memoizedState: {},
                                stateNode: document.createElement('div'),
                                sibling: {
                                    type: 'div',
                                    memoizedProps: {},
                                    memoizedState: {},
                                    stateNode: document.createElement('div'),
                                },
                            },
                        },
                    },
                },
            },
        },
    },
}

export const fragmentTree = {
    name: undefined,
    children: [
        {
            name: 'FragmentComponent',
            isFragment: true,
            node: [
                document.createElement('div'),
                document.createElement('span'),
                document.createElement('span'),
                document.createTextNode('text'),
                [
                    document.createElement('div'),
                    document.createElement('div'),
                ],
            ],
            children: [
                {
                    name: 'div',
                    props: {},
                    state: {},
                    node: document.createElement('div'),
                },
                {
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('span'),
                    children: [],
                },
                {
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: { testState: true },
                    node: document.createElement('span'),
                    children: [],
                },
                {
                    name: undefined,
                    props: {},
                    state: {},
                    node: document.createTextNode('text'),
                    children: [],
                },
                {
                    name: 'NestedFragmentComponent',
                    isFragment: true,
                    node: [
                        document.createElement('div'),
                        document.createElement('div'),
                    ],
                    children: [
                        {
                            name: 'div',
                            props: {},
                            state: {},
                            node: document.createElement('div'),
                        },
                        {
                            name: 'div',
                            props: {},
                            state: {},
                            node: document.createElement('div'),
                        },
                    ],
                },
            ],
        },
    ],
}

export const treeWithNonObjectState = {
    name: undefined,
    children: [
        {
            name: 'TestWrapper',
            props: { myProps: 'test prop' },
            state: { initialized: true },
            children: [
                {
                    name: 'div',
                    props: {},
                    state: {},
                    node: document.createElement('div'),
                    children: [
                        {
                            name: 'div',
                            props: { testProp: 'some prop' },
                            state: 'some state',
                            node: document.createElement('div'),
                            children: [],
                        },
                        {
                            name: 'div',
                            props: { testProp: 'some prop' },
                            state: true,
                            node: document.createElement('div'),
                            children: [],
                        },
                        {
                            name: 'div',
                            props: { },
                            state: [1, 2, 3],
                            node: document.createElement('div'),
                            children: [],
                        },
                        {
                            name: 'div',
                            props: { },
                            state: [1, 2, 3, 4, 5],
                            node: document.createElement('div'),
                            children: [],
                        },
                        {
                            name: 'div',
                            props: { },
                            state: 123,
                            node: document.createElement('div'),
                            children: [],
                        },
                    ],
                },
            ],
            node: document.createElement('div'),
        },
    ],
    props: undefined,
    state: {},
    node: null,
}
