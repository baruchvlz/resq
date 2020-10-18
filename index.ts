import ReactSelectorQuery from './src/resq'
import { waitToLoadReact } from './src/waitToLoadReact'
import { findReactInstance } from './src/utils'

function doQuery(selector: any, method: any, element: any) {
    if (!element && !window.isReactLoaded) {
        throw new Error('Could not find the root element of your application')
    }

    let reactInstance = window.rootReactElement

    if (element instanceof HTMLElement) {
        reactInstance = findReactInstance(element)
    }

    if (!reactInstance) {
        throw new Error('Could not find instance of React in given element')
    }

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return new ReactSelectorQuery(selector, reactInstance)[method]()
}

export function resq$(selector: any, element: any) {
    return doQuery(selector, 'find', element)
}

export function resq$$(selector: any, element: any) {
    return doQuery(selector, 'findAll', element)
}

export { waitToLoadReact }
