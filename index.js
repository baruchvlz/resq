import ReactSelectorQuery from './src/resq'
import { waitToLoadReact, waitToLoadReactPlayerWeb } from './src/waitToLoadReact'
import { findReactInstance } from './src/utils'

function doQuery(selector, method, element) {
    if (!element && !global.isReactLoaded) {
        throw new Error('Could not find the root element of your application')
    }

    let reactInstance = global.rootReactElement

    if (element instanceof HTMLElement) {
        reactInstance = findReactInstance(element)
    }

    if (!reactInstance) {
        throw new Error('Could not find instance of React in given element')
    }

    return new ReactSelectorQuery(selector, reactInstance)[method]()
}

export function resq$(selector, element) {
    return doQuery(selector, 'find', element)
}

export function resq$$(selector, element) {
    return doQuery(selector, 'findAll', element)
}

export { waitToLoadReact, waitToLoadReactPlayerWeb }
