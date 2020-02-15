import { getGlobalThis } from '@offirmo/globalthis-ponyfill'
import { waitToLoadReact } from '../src/waitToLoadReact'

import { vdom } from './__mocks__/vdom'

const globalThis = getGlobalThis()

afterEach(() => {
    globalThis.isReactLoaded = false
    globalThis.document = {}
    globalThis.document.createTreeWalker = () => ({
        currentNode: {},
        nextNode: () => false,
    })
    globalThis.document.querySelector = () => {}
})

describe('waitToLoadReact', () => {
    it ('should return if react is already loaded', async () => {
        globalThis.isReactLoaded = true

        const res = await waitToLoadReact(10)
        expect(res).toBe('React already loaded')
    })

    it('should find react root element', async () => {
        globalThis.document.createTreeWalker = () => ({
            currentNode: {
                _reactRootContainer: { _internalRoot: { current: vdom } },
            },
            nextNode: () => true,
        })
        await waitToLoadReact(10)

        expect(globalThis.rootReactElement).toMatchObject(vdom)
    })

    it('should find react root element if user pases selector', async () => {
        globalThis.document.querySelector = jest.fn().mockReturnValue({
            _reactRootContainer: { _internalRoot: { current: vdom } },
        })

        await waitToLoadReact(10, '#test')

        expect(globalThis.document.querySelector).toHaveBeenCalledWith('#test')
        expect(globalThis.rootReactElement).toMatchObject(vdom)
    })

    it('should timeout if React app is not found', () => {
        waitToLoadReact(10).catch((err) =>  {
            expect(err).toMatch('Timed out')
        })
    })
})
