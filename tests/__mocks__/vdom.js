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
                            name: 'div',
                            props: { testProp: 'some prop' },
                            state: { testState: true },
                            node: document.createElement('div'),
                            children: [],
                        },
                        {
                            name: 'div',
                            props: {},
                            state: { testState: true },
                            node: document.createElement('div'),
                            children: [],
                        },
                        {
                            name: 'div',
                            props: {},
                            state: { testState: true },
                            node: document.createElement('div'),
                            children: [],
                        },
                    ],
                },
            ],
            node: {
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
            },
        },
    ],
    props: undefined,
    state: {},
    node: undefined,
}
