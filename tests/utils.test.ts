import {
    buildFragmentNodeArray,
    buildNodeTree,
    filterNodesBy,
    findInTree,
    findSelectorInTree,
    verifyIfArraysMatch,
    verifyIfObjectsMatch,
    findReactInstance,
    matchSelector,
    stripHoCFromName,
} from '../src/utils'

import {
    tree,
    vdom,
    fragmentVDOM,
    fragmentTree,
    treeWithNonObjectState,
    treeWithStyledComponents,
    treeForWildcards,
} from './__mocks__/vdom'

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeAll'.
beforeAll(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.isReactLoaded = true
})

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('utils', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('buildNodeTree', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return empty tree', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(buildNodeTree()).toMatchObject({ children: [] })
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should build tree', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(buildNodeTree(vdom)).toMatchObject(tree)
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should build tree for fragments', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(buildNodeTree(fragmentVDOM)).toMatchObject(fragmentTree)
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('findInTree', () => {
        let results = [tree]
        const selectors = ['TestWrapper', 'div']

        selectors.forEach((selector) => {
            results = findInTree(results, (child: any) => child.name === selector)
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(results.length).toBe(2)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(results).toMatchObject([
            {
                name: 'div',
                props: {},
                state: {},
                node: document.createElement('div'),
            },
            {
                name: 'div',
                props: { },
                state: {
                    testState: true,
                },
                node: document.createElement('div'),
            },
        ])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('findSelectorInTree', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return all intances of nested selectors', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree('TestWrapper span'.split(' '), tree)

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(2)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
                {
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('span'),
                },
                {
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: { testState: true },
                    node: document.createElement('span'),
                    children: [],
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly use a custom search fn', () => {
            const results = findSelectorInTree(
                'TestWrapper div'.split(' '),
                tree,
                false,
                (child: any) => child.name !== 'div',
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(3)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
                {
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('span'),
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
                    props: 'Foo bar',
                    state: { testState: true },
                    node: document.createTextNode('Foo bar'),
                    children: [],
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find a styled component', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['styled__Button'],
                treeWithStyledComponents,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
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
                    node: document.createElement('button'),
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find a nested styled component', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['TestWrapper', 'styled__Button'],
                treeWithStyledComponents,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
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
                    node: document.createElement('div'),
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find a child of styled component', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['TestWrapper', 'styled__Div', 'MyButton'],
                treeWithStyledComponents,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
                {
                    name: 'MyButton',
                    props: { someProp: 'some prop value' },
                    state: {},
                    node: document.createElement('button'),
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find a nested node', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['styled__Div'],
                treeWithStyledComponents,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
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
                    node: document.createElement('div'),
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly not find a node', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['AnyComponentDoesnotExist'],
                treeWithStyledComponents,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(0)
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('matchSelector', () => {
        [
            {
                selector: 'simpleNodeName',
                nodeName: 'simpleNodeName',
                match: true,
            },
            {
                selector: 'simpleNode',
                nodeName: 'simpleNodeName',
                match: false,
            },
            {
                selector: 'simpleNodeName',
                nodeName: 'simpleNode',
                match: false,
            },
            {
                selector: 'simpleWildcardNode*',
                nodeName: 'simpleWildcardNode',
                match: false,
            },
            {
                selector: 'simpleWildcardNode*',
                nodeName: 'simpleWildcardNodeName',
                match: true,
            },
            {
                selector: 'simple*Node*',
                nodeName: 'simpleWildcardNodeName',
                match: true,
            },
            {
                selector: '*Node*',
                nodeName: 'simpleWildcardNodeName',
                match: true,
            },
            {
                selector: 'special_characters',
                nodeName: 'node_with(special_characters)',
                match: true,
            },
            {
                selector: 'special_chara*',
                nodeName: 'node_with(special_characters)',
                match: true,
            },
            {
                selector: '*',
                nodeName: 'node_with(special_characters)',
                match: true,
            },
        ].forEach(({match, nodeName, selector}) => {
            // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it(`Should${match ? '' : 'n\'t'} match node "${nodeName}" to selector "${selector}"`,
                () => {
                    if (match) {
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
                        expect(matchSelector(selector, nodeName)).toBeTruthy()

                    } else {
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
                        expect(matchSelector(selector, nodeName)).toBeFalsy()
                    }
                })
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('findSelectorInTree with wildcards', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find nodes by wildcard in the end of selector', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['TestWrapper', 'Test*'],
                treeForWildcards,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(2)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
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
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find nodes by wildcard in the start of selector', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['TestWrapper', '*Test'],
                treeForWildcards,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
                {
                    name: 'NameTest',
                    props: { testProp: 'some prop 2' },
                    state: { testState: true },
                    node: document.createElement('span'),
                    children: [],
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find nodes by wildcard in the middle of selector', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['TestWrapper', '*am*'],
                treeForWildcards,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(3)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
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
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find all nodes by wildcards', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['TestWrapper', '*'],
                treeForWildcards,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(5)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
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
                {
                    name: 'div',
                    props: { testProp: 'some prop 4' },
                    node: document.createElement('div'),
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should correctly find nodes behind wildcard node', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const results = findSelectorInTree(
                ['TestWrapper', '*', 'div'],
                treeForWildcards,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
                {
                    name: 'div',
                    props: { testProp: 'some prop 4' },
                    node: document.createElement('div'),
                },
            ])
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('filterNodesBy', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should non-strictly match objects', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const nodes = findSelectorInTree(['TestWrapper'], tree)
            const results = filterNodesBy(nodes, 'props', { myProps: 'test prop' })

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject(tree.children)
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should strictly match objects when `exact` flag is true', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const nodes = findSelectorInTree(['TestWrapper', 'div'], tree)
            const results = filterNodesBy(
                nodes,
                'state',
                { testState: true, otherState: 'foo' },
                true,
            )

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(results).toMatchObject([
                {
                    name: 'div',
                    props: { },
                    state: { testState: true, otherState: 'foo' },
                    node: document.createElement('div'),
                    children: [],
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should work for any type of state', () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const nodes = findSelectorInTree(['TestWrapper', 'div'], treeWithNonObjectState)
            const arrayState = filterNodesBy(nodes, 'state', [1, 2, 3])
            const numberState = filterNodesBy(nodes, 'state', 123)
            const stringState = filterNodesBy(nodes, 'state', 'some state')
            const booleanState = filterNodesBy(nodes, 'state', true)

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(booleanState).toMatchObject([
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: true,
                    node: document.createElement('div'),
                    children: [],
                },
            ])
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(arrayState).toMatchObject([
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
            ])
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(numberState).toMatchObject([
                {
                    name: 'div',
                    props: { },
                    state: 123,
                    node: document.createElement('div'),
                    children: [],
                },
            ])
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(stringState).toMatchObject([
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: 'some state',
                    node: document.createElement('div'),
                    children: [],
                },
            ])
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not match functions', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
            global.console.warn = jest.fn()
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const nodes = findSelectorInTree(['TestWrapper', 'div'], treeWithNonObjectState)

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(filterNodesBy(nodes, 'state', () => {})).toMatchObject([])
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(global.console.warn).toHaveBeenCalled()
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('verifyIfArraysMatch', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false if not arrays or arrays not same length', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch(1, [2])).toBeFalsy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch([1], 2)).toBeFalsy()
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return true if arrays have equal values', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch(['a'], ['a', 'b'])).toBeTruthy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch(['2', '3', '4', '5'], ['3', '4'])).toBeTruthy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch([5], [1, 2, 3, 4, 5])).toBeTruthy()
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should retun false if arrays do not have matching elements', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch([1, 2, 3], [4, 5, 6])).toBeFalsy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch(['a', 'b'], ['c', 'd'])).toBeFalsy()
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should exactly match arrays', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch([1, 2, 3], [1, 2, 3], true)).toBeTruthy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch([1, 2, 3], [1, 2, 4], true)).toBeFalsy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfArraysMatch([1, 2, 3], [1, 2, 3, 4, 5], true)).toBeFalsy()
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('verifyIfObjectsMatch', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false if objects do not match', () => {
            const o1 = { bar: true }
            const o2 = { bar: false }

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(o1, o2)).toBeFalsy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch({ a: 1 }, {})).toBeFalsy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch({}, { a: 1 })).toBeTruthy()
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false if verify is null', () => {
            const m1 = { }
            const m2 = { bar: true }
            const v1 = null
            const v2 = { bar: true }

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(m2, v1)).toBeFalsy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(m2, v2)).toBeTruthy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(m1, v2)).toBeTruthy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(m1, v1)).toBeTruthy()
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should do simple matches', () => {
            const matcher = [
                { a: undefined, b: undefined },
                { a: {}, b: {} },
                { a: {}, b: { bar: 123 } },
                { a: { bar: 123 }, b: { bar: 123 } },
                { a: { bar: true }, b: { bar: true } },
                { a: { bar: 'abc' }, b: { bar: 'abc' } },
                { a: { bar: ['a'] }, b: { bar: ['a'] } },
                { a: { bar: 123, foo: 321 }, b: { bar: 123 } },
                { a: { bar: { foo: true } }, b: { bar: { foo: true } } },
            ]

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            matcher.forEach(m => expect(verifyIfObjectsMatch(m.a, m.b)).toBeTruthy())
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should work for insane deep values', () => {
            const o1 = {
                foo: { bar: { abc: { maybe: { works: true } } } },
            }
            const o2 = {
                foo: { bar: { abc: { maybe: { works: false } } } },
            }
            const o3 = {
                foo: { bar: { abc: { maybe: { works: true } } } },
            }

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(o1, o2)).toBeFalsy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(o1, o3)).toBeTruthy()
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should match all values', () => {
            const m1 = { a: 123, b: 'abc' }
            const m2 = { a: 123, b: 'def' }
            const v = { a: 123, b: 'abc', c: true }

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(m1, v)).toBeTruthy()
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(verifyIfObjectsMatch(m2, v)).toBeFalsy()
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('buildFragmentNodeArray', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return array of nodes for fragment elements', () => {
            const tree = {
                isFragment: true,
                name: 'MyFragmentComponent',
                children: [...Array(3)].map(() => ({ node: document.createElement('div') })),
            }

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(buildFragmentNodeArray(tree)).toMatchObject([
                document.createElement('div'),
                document.createElement('div'),
                document.createElement('div'),
            ])
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('findReactInstance', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return instance of passed HTML has one', () => {
            const element = {
                __reactInternalInstance$test1234: true,
            }

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(findReactInstance(element)).toBeTruthy()
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return undefined if no instance is found', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(findReactInstance(document.createElement('div'))).toBeFalsy()
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('stripHoCFromName', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not do anyting if component name is missing', () => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(stripHoCFromName()).toBe(undefined)
        })
    })
})
