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
                    type: 'div',
                    memoizedProps: {
                        testProp: 'some prop',
                        children: [{}],
                    },
                    memoizedState: {
                        testState: true,
                    },
                    stateNode: document.createElement('div'),
                    sibling: {
                        type: 'div',
                        memoizedProps: {},
                        memoizedState: {
                            testState: true,
                        },
                        stateNode: document.createElement('div'),
                        sibling: {
                            type: 'div',
                            memoizedProps: {},
                            memoizedState: {
                                testState: true,
                            },
                            stateNode: document.createElement('div'),
                        },
                    },
                },
            },
        },
        stateNode: {},
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
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('span'),
                },
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: { testState: true },
                    node: document.createElement('div'),
                },
                {
                    name: 'div',
                    props: {},
                    state: { testState: true },
                    node: document.createElement('div'),
                },
                {
                    name: 'div',
                    props: {},
                    state: { testState: true },
                    node: document.createElement('div'),
                },
            ],
            node: document.createElement('div'),
        },
    ],
    props: undefined,
    state: {},
    node: undefined,
}
