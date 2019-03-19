import {
    buildNodeTree,
    filterNodesBy,
    findInTree,
    findSelectorInTree,
    getElementType,
} from '../src/utils'
import { tree, vdom } from './__mocks__/vdom'

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
            expect(buildNodeTree(vdom)).toMatchSnapshot()
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
                props: { testProp: 'some prop' },
                state: {},
                node: document.createElement('div'),
            },
            {
                name: 'div',
                props: { testProp: 'some prop' },
                state: {
                    testState: true,
                },
                node: document.createElement('div'),
            },
        ])
        expect(results).toMatchSnapshot()
    })

    describe('findSelectorInTree', () => {
        it('should return all intances of nested selectors', () => {
            const results = findSelectorInTree('TestWrapper span'.split(' '), tree)

            expect(results.length).toBe(1)
            expect(results).toMatchObject([
                {
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('span'),
                },
            ])
            expect(results).toMatchSnapshot()
        })

        it('should correctly use a custom search fn', () => {
            const results = findSelectorInTree(
                'TestWrapper span'.split(' '),
                tree,
                false,
                (child) => child.name !== 'span',
            )

            expect(results.length).toBe(2)
            expect(results).toMatchObject([
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('div'),
                },
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: {
                        testState: true,
                    },
                    node: document.createElement('div'),
                },
            ])
            expect(results).toMatchSnapshot()
        })
    })

    test('filterNodesBy', () => {
        const nodes = findSelectorInTree(['TestWrapper'], tree)
        const results = filterNodesBy(nodes, 'props', { myProps: 'test prop' })

        expect(results.length).toBe(1)
        expect(results).toMatchObject(tree.children)
    })
})
