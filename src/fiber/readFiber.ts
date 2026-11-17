import type { Fiber, ResqDomNode, ResqNodeTarget } from '../types'
import { isDomNode } from './domNode'

export function listChildFibers(fiber: Fiber): Fiber[] {
    const childFibers: Fiber[] = []

    for (let child = fiber.child; child; child = child.sibling) {
        childFibers.push(child)
    }

    return childFibers
}

/** Props without `children`, since children are exposed through `RESQNode.children`. */
export function readProps(fiber: Fiber): unknown {
    const props = fiber.memoizedProps

    // string props are the text content of a text node
    if (!props || typeof props === 'string') {
        return props
    }

    const propsWithoutChildren = { ...(props as Record<string, unknown>) }

    delete propsWithoutChildren.children

    return propsWithoutChildren
}

/**
 * Class components keep their state in `memoizedState`. Function components using hooks keep a
 * hook list there, whose first entry holds the state in `baseState`.
 */
export function readState(fiber: Fiber): unknown {
    const state = fiber.memoizedState

    if (!state) {
        return undefined
    }

    const { baseState } = state as { baseState?: unknown }

    return baseState || state
}

function readOwnDomNode(fiber: Fiber): ResqDomNode | null {
    if (isDomNode(fiber.stateNode)) {
        return fiber.stateNode
    }

    if (fiber.child && isDomNode(fiber.child.stateNode)) {
        return fiber.child.stateNode
    }

    return null
}

function isFragmentFiber(fiber: Fiber, childCount: number): boolean {
    return typeof fiber.type === 'function' && childCount > 1
}

export function isFragment(fiber: Fiber): boolean {
    return isFragmentFiber(fiber, listChildFibers(fiber).length)
}

/**
 * The DOM node a fiber rendered. Components rendering several siblings (fragments) return all of
 * their children's nodes.
 */
export function readDomNode(fiber: Fiber): ResqNodeTarget {
    const childFibers = listChildFibers(fiber)

    if (isFragmentFiber(fiber, childFibers.length)) {
        return childFibers
            .map(readDomNode)
            .flat()
            .filter((domNode): domNode is ResqDomNode => domNode !== null)
    }

    return readOwnDomNode(fiber)
}

/** Breadth-first search for the first DOM node rendered anywhere below `fiber`. */
export function findFirstDescendantDomNode(fiber: Fiber): ResqNodeTarget {
    const queue = listChildFibers(fiber)

    for (let queueIndex = 0; queueIndex < queue.length; queueIndex++) {
        const queuedFiber = queue[queueIndex] as Fiber
        const domNode = readDomNode(queuedFiber)

        if (domNode && (!Array.isArray(domNode) || domNode.length > 0)) {
            return domNode
        }

        for (let child = queuedFiber.child; child; child = child.sibling) {
            queue.push(child)
        }
    }

    return null
}
