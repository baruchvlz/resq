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
    stripHOCsFromName,
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

beforeAll(() => {
    global.isReactLoaded = true
})

describe('utils', () => {
    describe('buildNodeTree', () => {
        it('should return empty tree', () => {
            expect(buildNodeTree()).toMatchObject({ children: [] })
        })

        it('should build tree', () => {
            expect(buildNodeTree(vdom)).toMatchObject(tree)
        })

        it('should build tree for fragments', () => {
            expect(buildNodeTree(fragmentVDOM)).toMatchObject(fragmentTree)
        })
    })

    test('findInTree', () => {
        let results = [tree]
        const selectors = ['TestWrapper', 'div']

        selectors.forEach((selector) => {
            results = findInTree(results, child => child.name === selector)
        })

        expect(results.length).toBe(2)
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

    describe('findSelectorInTree', () => {
        it('should return all intances of nested selectors', () => {
            const results = findSelectorInTree('TestWrapper span'.split(' '), tree)

            expect(results.length).toBe(2)
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

        it('should correctly use a custom search fn', () => {
            const results = findSelectorInTree(
                'TestWrapper div'.split(' '),
                tree,
                false,
                (child) => child.name !== 'div',
            )

            expect(results.length).toBe(3)
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

        it('should correctly find a styled component', () => {
            const results = findSelectorInTree(
                ['styled__Button'],
                treeWithStyledComponents,
            )

            expect(results.length).toBe(1)
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

        it('should correctly find a nested styled component', () => {
            const results = findSelectorInTree(
                ['TestWrapper', 'styled__Button'],
                treeWithStyledComponents,
            )

            expect(results.length).toBe(1)
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

        it('should correctly find a child of styled component', () => {
            const results = findSelectorInTree(
                ['TestWrapper', 'styled__Div', 'MyButton'],
                treeWithStyledComponents,
            )

            expect(results.length).toBe(1)
            expect(results).toMatchObject([
                {
                    name: 'MyButton',
                    props: { someProp: 'some prop value' },
                    state: {},
                    node: document.createElement('button'),
                },
            ])
        })

        it('should correctly find a nested node', () => {
            const results = findSelectorInTree(
                ['styled__Div'],
                treeWithStyledComponents,
            )

            expect(results.length).toBe(1)
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

        it('should correctly not find a node', () => {
            const results = findSelectorInTree(
                ['AnyComponentDoesnotExist'],
                treeWithStyledComponents,
            )

            expect(results.length).toBe(0)
        })
    })

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
                selector: 'special_characters*',
                nodeName: 'node_with(special_characters)',
                match: false,
            },
            {
                selector: '*',
                nodeName: 'node_with(special_characters)',
                match: true,
            },
        ].forEach(({match, nodeName, selector}) => {
            it(`Should${match ? '' : 'n\'t'} match node "${nodeName}" to selector "${selector}"`,
                () => {
                    if (match) {
                        expect(matchSelector(selector, nodeName)).toBeTruthy()

                    } else {
                        expect(matchSelector(selector, nodeName)).toBeFalsy()
                    }
                })
        })
    })

    describe('findSelectorInTree with wildcards', () => {
        it('should correctly find nodes by wildcard in the end of selector', () => {
            const results = findSelectorInTree(
                ['TestWrapper', 'Test*'],
                treeForWildcards,
            )

            expect(results.length).toBe(2)
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

        it('should correctly find nodes by wildcard in the start of selector', () => {
            const results = findSelectorInTree(
                ['TestWrapper', '*Test'],
                treeForWildcards,
            )

            expect(results.length).toBe(1)
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

        it('should correctly find nodes by wildcard in the middle of selector', () => {
            const results = findSelectorInTree(
                ['TestWrapper', '*am*'],
                treeForWildcards,
            )

            expect(results.length).toBe(3)
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

        it('should correctly find all nodes by wildcards', () => {
            const results = findSelectorInTree(
                ['TestWrapper', '*'],
                treeForWildcards,
            )

            expect(results.length).toBe(5)
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

        it('should correctly find nodes behind wildcard node', () => {
            const results = findSelectorInTree(
                ['TestWrapper', '*', 'div'],
                treeForWildcards,
            )

            expect(results.length).toBe(1)
            expect(results).toMatchObject([
                {
                    name: 'div',
                    props: { testProp: 'some prop 4' },
                    node: document.createElement('div'),
                },
            ])
        })
    })

    describe('filterNodesBy', () => {
        it('should non-strictly match objects', () => {
            const nodes = findSelectorInTree(['TestWrapper'], tree)
            const results = filterNodesBy(nodes, 'props', { myProps: 'test prop' })

            expect(results.length).toBe(1)
            expect(results).toMatchObject(tree.children)
        })

        it('should strictly match objects when `exact` flag is true', () => {
            const nodes = findSelectorInTree(['TestWrapper', 'div'], tree)
            const results = filterNodesBy(
                nodes,
                'state',
                { testState: true, otherState: 'foo' },
                true,
            )

            expect(results.length).toBe(1)
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

        it('should work for any type of state', () => {
            const nodes = findSelectorInTree(['TestWrapper', 'div'], treeWithNonObjectState)
            const arrayState = filterNodesBy(nodes, 'state', [1, 2, 3])
            const numberState = filterNodesBy(nodes, 'state', 123)
            const stringState = filterNodesBy(nodes, 'state', 'some state')
            const booleanState = filterNodesBy(nodes, 'state', true)

            expect(booleanState).toMatchObject([
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: true,
                    node: document.createElement('div'),
                    children: [],
                },
            ])
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
            expect(numberState).toMatchObject([
                {
                    name: 'div',
                    props: { },
                    state: 123,
                    node: document.createElement('div'),
                    children: [],
                },
            ])
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

        it('should not match functions', () => {
            global.console.warn = jest.fn()
            const nodes = findSelectorInTree(['TestWrapper', 'div'], treeWithNonObjectState)

            expect(filterNodesBy(nodes, 'state', () => {})).toMatchObject([])
            expect(global.console.warn).toHaveBeenCalled()
        })
    })

    describe('verifyIfArraysMatch', () => {
        it('should return false if not arrays or arrays not same length', () => {
            expect(verifyIfArraysMatch(1, [2])).toBeFalsy()
            expect(verifyIfArraysMatch([1], 2)).toBeFalsy()
        })

        it('should return true if arrays have equal values', () => {
            expect(verifyIfArraysMatch(['a'], ['a', 'b'])).toBeTruthy()
            expect(verifyIfArraysMatch(['2', '3', '4', '5'], ['3', '4'])).toBeTruthy()
            expect(verifyIfArraysMatch([5], [1, 2, 3, 4, 5])).toBeTruthy()
        })

        it('should retun false if arrays do not have matching elements', () => {
            expect(verifyIfArraysMatch([1, 2, 3], [4, 5, 6])).toBeFalsy()
            expect(verifyIfArraysMatch(['a', 'b'], ['c', 'd'])).toBeFalsy()
        })

        it('should exactly match arrays', () => {
            expect(verifyIfArraysMatch([1, 2, 3], [1, 2, 3], true)).toBeTruthy()
            expect(verifyIfArraysMatch([1, 2, 3], [1, 2, 4], true)).toBeFalsy()
            expect(verifyIfArraysMatch([1, 2, 3], [1, 2, 3, 4, 5], true)).toBeFalsy()
        })
    })

    describe('verifyIfObjectsMatch', () => {
        it('should return false if objects do not match', () => {
            const o1 = { bar: true }
            const o2 = { bar: false }

            expect(verifyIfObjectsMatch(o1, o2)).toBeFalsy()
            expect(verifyIfObjectsMatch({ a: 1 }, {})).toBeFalsy()
            expect(verifyIfObjectsMatch({}, { a: 1 })).toBeTruthy()
        })

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

            matcher.forEach(m => expect(verifyIfObjectsMatch(m.a, m.b)).toBeTruthy())
        })

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

            expect(verifyIfObjectsMatch(o1, o2)).toBeFalsy()
            expect(verifyIfObjectsMatch(o1, o3)).toBeTruthy()
        })
    })

    describe('buildFragmentNodeArray', () => {
        it('should return array of nodes for fragment elements', () => {
            const tree = {
                isFragment: true,
                name: 'MyFragmentComponent',
                children: [...Array(3)].map(() => ({ node: document.createElement('div') })),
            }

            expect(buildFragmentNodeArray(tree)).toMatchObject([
                document.createElement('div'),
                document.createElement('div'),
                document.createElement('div'),
            ])
        })
    })

    describe('findReactInstance', () => {
        it('should return instance of passed HTML has one', () => {
            const element = {
                __reactInternalInstance$test1234: true,
            }

            expect(findReactInstance(element)).toBeTruthy()
        })

        it('should return undefined if no instance is found', () => {
            expect(findReactInstance(document.createElement('div'))).toBeFalsy()
        })
    })

    describe('stripHOCsFromName', () => {
        it('should correctly strip HoC', () => {
            expect(stripHOCsFromName('Test(HoC(MyComponent)')).toBe('MyComponent')
        })
        it('should throw if passing a non string', () => {
            try {
                stripHOCsFromName({})
            } catch (e) {
                expect(e).toBeTruthy()
            }
        })
    })
})
