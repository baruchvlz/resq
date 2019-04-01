import ReactSelectorQuery from './src/resq'
import { waitToLoadReact } from './src/waitToLoadReact'

function doQuery(selector, method = 'find') {
    if (!global.isReactLoaded) {
        return 'Could not find the root element of your application'
    }

    return new ReactSelectorQuery(selector, global.rootReactElement)[method]()
}

export function resq$(selector) {
    return doQuery(selector)
}

export function resq$$(selector) {
    return doQuery(selector, 'findAll')
}

export { waitToLoadReact }
