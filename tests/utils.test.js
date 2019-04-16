import {
    buildNodeTree,
    filterNodesBy,
    findInTree,
    findSelectorInTree,
    getElementType,
    verifyIfArraysMatch,
    match,
    buildFragmentNodeArray,
} from '../src/utils'
import { tree, vdom, fragmentVDOM, fragmentTree } from './__mocks__/vdom'

beforeAll(() => {
    global.isReactLoaded = true
})

describe('utils', () => {
    test('getElementType', () => {
        expect(getElementType('test')).toBe('test')
        expect(getElementType(function testFn() {})).toBe('testFn')
    })

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
                { exact: true },
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
    })

    describe('match', () => {
        it('should return false if objects do not match', () => {
            const o1 = { bar: true }
            const o2 = { bar: false }

            expect(match(o1, o2)).toBeFalsy()
            expect(match({ a: 1 }, {})).toBeFalsy()
            expect(match({}, { a: 1 })).toBeTruthy()
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

            matcher.forEach(m => expect(match(m.a, m.b)).toBeTruthy())
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

            expect(match(o1, o2)).toBeFalsy()
            expect(match(o1, o3)).toBeTruthy()
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
})
