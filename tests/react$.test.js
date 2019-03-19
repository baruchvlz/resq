// import { resq$ } from '../src/resq$'

import { vdom, } from './__mocks__/vdom'

global.document.querySelector = function querySeletor() {
    return {
        _reactRootContainer: {
            _internalRoot: {
                current: vdom,
            },
        },
    }
}

describe('resq$', () => {
    it('', () => {})
})
