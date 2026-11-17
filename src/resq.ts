import { ResqError } from './errors'
import { findFiberRoot } from './fiber/findFiberRoot'
import { isElement } from './fiber/domNode'
import { ReactSelectorQuery } from './query/ReactSelectorQuery'
import { getLoadedRootFiber } from './root/rootStore'
import type { Fiber, RESQNode, RESQNodes } from './types'

function resolveRootFiber(element: Element | undefined): Fiber {
    if (element === undefined) {
        const loadedRootFiber = getLoadedRootFiber()

        if (!loadedRootFiber) {
            throw new ResqError('ROOT_NOT_LOADED', 'Could not find the root element of your application')
        }

        return loadedRootFiber
    }

    if (!isElement(element)) {
        throw new ResqError('INVALID_ELEMENT', 'The given element is not a DOM element')
    }

    const elementFiber = findFiberRoot(element)

    if (!elementFiber) {
        throw new ResqError('REACT_INSTANCE_NOT_FOUND', 'Could not find instance of React in given element')
    }

    return elementFiber
}

/**
 * Selects the first React component matching `selector`.
 *
 * @param selector component names separated by spaces (descendant chain), `*` is a wildcard
 * @param element DOM element to search from. Defaults to the root found by `waitToLoadReact`
 * @returns the first match, or `undefined` when nothing matches
 */
export function resq$(selector: string, element?: Element): RESQNode | undefined {
    return new ReactSelectorQuery(selector, resolveRootFiber(element)).find()
}

/** Selects every React component matching `selector`. See {@link resq$}. */
export function resq$$(selector: string, element?: Element): RESQNodes {
    return new ReactSelectorQuery(selector, resolveRootFiber(element)).findAll()
}
