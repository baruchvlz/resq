import { waitToLoadReact } from '../src/waitToLoadReact'

import { vdom } from './__mocks__/vdom'

afterEach(() => {
    global.isReactLoaded = false
    global.document = {}
    global.document.createTreeWalker = () => ({
        currentNode: {},
        nextNode: () => false,
    })
    global.document.querySelector = () => {}
})

describe('waitToLoadReact', () => {
    it('should find react root element', async () => {
        global.document.createTreeWalker = () => ({
            currentNode: {
                _reactRootContainer: { _internalRoot: { current: vdom } },
            },
            nextNode: () => true,
        })
        await waitToLoadReact(10)

        expect(global.rootReactElement).toMatchObject(vdom)
    })

    it('should find react root element if user pases selector', async () => {
        global.document.querySelector = jest.fn().mockReturnValue({
            _reactRootContainer: { _internalRoot: { current: vdom } },
        })

        await waitToLoadReact(10, '#test')

        expect(global.document.querySelector).toHaveBeenCalledWith('#test')
        expect(global.rootReactElement).toMatchObject(vdom)
    })

    it('should timeout if React app is not found', () => {
        waitToLoadReact(10).catch((err) =>  {
            expect(err).toMatch('Timed out')
        })
    })
})
