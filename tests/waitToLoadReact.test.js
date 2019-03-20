import { waitToLoadReact } from '../src/waitToLoadReact'

import { vdom } from './__mocks__/vdom'

afterEach(() => {
    global.document = {}
    global.document.createTreeWalker = () => ({
        currentNode: {},
        nextNode: () => false,
    })
    global.document.querySelector = () => {}
})

describe('waitToLoadReact', () => {
    it('should find react root element', () => {
        global.document.createTreeWalker = () => ({
            currentNode: {
                _reactRootContainer: { _internalRoot: { current: vdom } },
            },
            nextNode: () => true,
        })

        waitToLoadReact(10).then((root) => {
            expect(root).toMatchObject(vdom)
        })
    })

    it('should find react root element if user pases selector', () => {
        global.document.querySelector = jest.fn().mockReturnValue({
            _reactRootContainer: { _internalRoot: { current: vdom } },
        })

        waitToLoadReact(10, '#root').then((root) => {
            expect(global.document.querySelector).toHaveBeenCalledWith('#root')
            expect(root).toMatchObject(vdom)
        })
    })

    it('should timeout if React app is not found', () => {
        waitToLoadReact(10).catch((err) =>  {
            expect(err).toMatch('Timed out')
        })
    })
})
