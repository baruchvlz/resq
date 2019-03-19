import {
    getElementType,
    buildNodeTree,
    findInTree,
} from '../src/utils'

import { vdom, tree, } from './__mocks__/vdom'

describe('utils', () => {
    it('getElementType', () => {
        expect(getElementType('test')).toBe('test')
        expect(getElementType(function testFn() {})).toBe('testFn')
    })

    it('buildNodeTree', () => {
        expect(buildNodeTree(vdom)).toMatchSnapshot()
    })

    it('findInTree', () => {
        let results = [tree,]
        const selectors = ['TestWrapper', 'div',]

        selectors.forEach((selector) => {
            results = findInTree(results, child => child.name === selector)
        })

        expect(results.length).toBe(2)
        expect(results).toMatchSnapshot()
    })
})
