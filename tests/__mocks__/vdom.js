export const vdom = {
    type: undefined,
    child: {
        type: function TestWrapper() {},
        memoizedProps: {
            myProps: 'test prop',
        },
        memoizedState: {
            initialized: true,
        },
        child: {
            type: 'div',
            memoizedProps: {},
            memoizedState: {},
            stateNode: document.createElement('div'),
            sibling: {
                type: 'span',
                memoizedProps: {},
                memoizedState: {},
                stateNode: document.createElement('span'),
                sibling: {
                    type: 'div',
                    memoizedProps: {},
                    memoizedState: {},
                    stateNode: document.createElement('div'),
                },
            },
        },
        stateNode: null,
    },
}

export const tree = {
    name: undefined,
    children: [
        {
            name: 'TestWrapper',
            props: {
                myProps: 'test prop',
            },
            state: {
                initialized: true,
            },
            children: [
                { name: 'div', props: {}, state: {}, node: document.createElement('div'), },
                { name: 'span', props: {}, state: {}, node: document.createElement('span'), },
                { name: 'div', props: {}, state: {}, node: document.createElement('div'), },
            ],
            node: {
                type: function TestWrapper() {},
                memoizedProps: {
                    myProps: 'test prop',
                },
                memoizedState: {
                    initialized: true,
                },
                child: {
                    type: 'div',
                    memoizedProps: {},
                    memoizedState: {},
                    stateNode: document.createElement('div'),
                    sibling: {
                        type: 'span',
                        memoizedProps: {},
                        memoizedState: {},
                        stateNode: document.createElement('span'),
                        sibling: {
                            type: 'div',
                            memoizedProps: {},
                            memoizedState: {},
                            stateNode: document.createElement('div'),
                        },
                    },
                },
                stateNode: null,
            },
        },
    ],
    props: {},
    state: {},
    node: vdom,
}
