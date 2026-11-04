import type { Fiber } from '../types'

const LEGACY_ROOT_CONTAINER_KEY = '_reactRootContainer'
const CONTAINER_KEY_PREFIX = '__reactContainer$'

/**
 * Key prefixes React stores a fiber under on a DOM element, in lookup priority order:
 * - `__reactContainer$`: the HostRoot fiber of a container (React 18 and 19 `createRoot`).
 * - `__reactFiber$`: the fiber of a rendered element (React 17 and later).
 * - `__reactInternalInstance$`: the fiber of a rendered element (React 16).
 */
const FIBER_KEY_PREFIXES = [CONTAINER_KEY_PREFIX, '__reactFiber$', '__reactInternalInstance$']

interface LegacyRootContainer {
    _internalRoot: { current: Fiber }
}

/** The object shared by both versions of a root fiber, pointing at the current one. */
interface FiberRootLike {
    current: Fiber
    containerInfo: unknown
}

function isFiberRoot(value: unknown): value is FiberRootLike {
    return typeof value === 'object' && value !== null && 'current' in value && 'containerInfo' in value
}

function findFiberRootOf(fiber: Fiber): FiberRootLike | undefined {
    let topFiber = fiber

    while (topFiber.return) {
        topFiber = topFiber.return
    }

    return isFiberRoot(topFiber.stateNode) ? topFiber.stateNode : undefined
}

/**
 * React stores a fiber on its DOM element once, when it is created. After updates that fiber can
 * be the stale half of the current / work-in-progress pair, so look for whichever of the two is in
 * the current tree. Returns `undefined` when neither is, or the fiber is detached (the element was
 * unmounted).
 */
function resolveCurrentFiber(fiber: Fiber): Fiber | undefined {
    const fiberRoot = findFiberRootOf(fiber)

    // a fiber that does not reach a root was detached by React (React before 18 keeps the key
    // on the DOM node of unmounted elements)
    if (!fiberRoot) {
        return undefined
    }

    if (!fiber.alternate && fiber.return) {
        return fiber
    }

    const candidateFibers = new Set<Fiber>([fiber])

    if (fiber.alternate) {
        candidateFibers.add(fiber.alternate)
    }

    const queue = [fiberRoot.current]

    for (let queueIndex = 0; queueIndex < queue.length; queueIndex++) {
        const queuedFiber = queue[queueIndex] as Fiber

        if (candidateFibers.has(queuedFiber)) {
            return queuedFiber
        }

        for (let child = queuedFiber.child; child; child = child.sibling) {
            queue.push(child)
        }
    }

    return undefined
}

/** Finds the current React fiber attached to a DOM element, or `undefined` if there is none. */
export function findFiberRoot(element: Element): Fiber | undefined {
    if (Object.prototype.hasOwnProperty.call(element, LEGACY_ROOT_CONTAINER_KEY)) {
        const legacyContainer = (element as unknown as Record<string, LegacyRootContainer>)[LEGACY_ROOT_CONTAINER_KEY]

        return legacyContainer?._internalRoot.current
    }

    const elementKeys = Object.keys(element)

    for (const keyPrefix of FIBER_KEY_PREFIXES) {
        const fiberKey = elementKeys.find(key => key.startsWith(keyPrefix))

        if (fiberKey) {
            return resolveCurrentFiber((element as unknown as Record<string, Fiber>)[fiberKey] as Fiber)
        }
    }

    return undefined
}

/** Whether the element is the container of a React root (legacy or `createRoot`). */
export function isReactRootContainer(element: Element): boolean {
    return Object.prototype.hasOwnProperty.call(element, LEGACY_ROOT_CONTAINER_KEY)
        || Object.keys(element).some(key => key.startsWith(CONTAINER_KEY_PREFIX))
}
