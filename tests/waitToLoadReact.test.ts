import { waitToLoadReact } from '../src/waitToLoadReact'

import { vdom } from './__mocks__/vdom'

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
afterEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.isReactLoaded = false
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.document = {}
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.document.createTreeWalker = () => ({
        currentNode: {},
        nextNode: () => false,
    })
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    global.document.querySelector = () => {}
})

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('waitToLoadReact', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it ('should return if react is already loaded', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
        global.isReactLoaded = true

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        const res = await waitToLoadReact(10)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(res).toBe('React already loaded')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should find react root element', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
        global.document.createTreeWalker = () => ({
            currentNode: {
                _reactRootContainer: { _internalRoot: { current: vdom } },
            },
            nextNode: () => true,
        })
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        await waitToLoadReact(10)

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(global.rootReactElement).toMatchObject(vdom)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should find react root element if user pases selector', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
        global.document.querySelector = jest.fn().mockReturnValue({
            _reactRootContainer: { _internalRoot: { current: vdom } },
        })

        await waitToLoadReact(10, '#test')

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(global.document.querySelector).toHaveBeenCalledWith('#test')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(global.rootReactElement).toMatchObject(vdom)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should timeout if React app is not found', () => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        waitToLoadReact(10).catch((err: any) => {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(err).toMatch('Timed out')
        })
    })
})
