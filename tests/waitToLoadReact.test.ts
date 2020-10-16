import { waitToLoadReact } from '../src/waitToLoadReact'

import { vdom } from './__mocks__/vdom'

afterEach(() => {
    (global as any).isReactLoaded = false;
    (global as any).document = {};
    (global as any).document.createTreeWalker = () => ({
        currentNode: {},
        nextNode: () => false,
    });
    global.document.querySelector = () => {};
})

describe('waitToLoadReact', () => {
    it ('should return if react is already loaded', async () => {
        (global as any).isReactLoaded = true

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        const res = await waitToLoadReact(10)
        expect(res).toBe('React already loaded')
    })

    it('should find react root element', async () => {
        (global as any).document.createTreeWalker = () => ({
            currentNode: {
                _reactRootContainer: { _internalRoot: { current: vdom } },
            },
            nextNode: () => true,
        })
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        await waitToLoadReact(10)

        expect((global as any).rootReactElement).toMatchObject(vdom)
    })

    it('should find react root element if user pases selector', async () => {
        global.document.querySelector = jest.fn().mockReturnValue({
            _reactRootContainer: { _internalRoot: { current: vdom } },
        })

        await waitToLoadReact(10, '#test')

        expect(global.document.querySelector).toHaveBeenCalledWith('#test')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(global.rootReactElement).toMatchObject(vdom)
    })

    it('should timeout if React app is not found', () => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        waitToLoadReact(10).catch((err: any) => {
            expect(err).toMatch('Timed out')
        })
    })
})
