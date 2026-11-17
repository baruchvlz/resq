import { findFiberRoot, isReactRootContainer } from '../fiber/findFiberRoot'
import type { Fiber } from '../types'

function findReactContainer(): Element | undefined {
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT)

    while (walker.nextNode()) {
        const element = walker.currentNode as Element

        if (isReactRootContainer(element)) {
            return element
        }
    }

    return undefined
}

/**
 * Looks for the root fiber of the page's React app, in the element matching `rootElementSelector`
 * when given, or in the first React root container found in the document. Returns `undefined`
 * while React has not rendered yet.
 */
export function locateRootFiber(rootElementSelector?: string): Fiber | undefined {
    const container = rootElementSelector === undefined
        ? findReactContainer()
        : document.querySelector(rootElementSelector)

    return container ? findFiberRoot(container) : undefined
}
