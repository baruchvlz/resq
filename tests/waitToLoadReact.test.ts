import { waitToLoadReact } from '../src/waitToLoadReact'

import { vdom } from './__mocks__/vdom'

afterEach(() => {
    window.isReactLoaded = false;
    (window as any).document = {}

    window.document.createTreeWalker = () => ({
        // @ts-expect-error
        currentNode: {},
        // @ts-expect-error
        nextNode: () => false,
    })
    window.document.querySelector = () => {}
})

describe('waitToLoadReact', () => {
    it ('should return if react is already loaded', async () => {
        window.isReactLoaded = true

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        const res = await waitToLoadReact(10)
        expect(res).toBe('React already loaded')
    })

    it('should find react root element', async () => {
        window.document.createTreeWalker = () => ({
            currentNode: {
                // @ts-expect-error
                _reactRootContainer: { _internalRoot: { current: vdom } },
            },
            // @ts-expect-error
            nextNode: () => true,
        })
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        await waitToLoadReact(10)

        expect(window.rootReactElement).toMatchObject(vdom)
    })

    it('should find react root element if user pases selector', async () => {
        window.document.querySelector = jest.fn().mockReturnValue({
            _reactRootContainer: { _internalRoot: { current: vdom } },
        })

        await waitToLoadReact(10, '#test')

        expect(window.document.querySelector).toHaveBeenCalledWith('#test')
        expect(window.rootReactElement).toMatchObject(vdom)
    })

    it('should timeout if React app is not found', () => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        waitToLoadReact(10).catch((err: any) => {
            expect(err).toMatch('Timed out')
        })
    })
})
