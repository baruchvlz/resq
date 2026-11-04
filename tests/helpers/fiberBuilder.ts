import type { Fiber } from '../../src/types'

interface FiberOptions {
    props?: unknown
    state?: unknown
    stateNode?: unknown
    children?: Fiber[]
}

/** Builds a Fiber linked through `child` / `sibling` like React does. */
export function buildFiber(type: unknown, { props, state, stateNode, children = [] }: FiberOptions = {}): Fiber {
    const fiber: Fiber = {
        type,
        memoizedProps: props ?? {},
        memoizedState: state,
        stateNode: stateNode ?? null,
        child: children[0] ?? null,
        sibling: null,
    }

    children.forEach((childFiber, childIndex) => {
        childFiber.sibling = children[childIndex + 1] ?? null
    })

    return fiber
}

/** A HostRoot fiber whose `stateNode` is the FiberRoot pointing back at it, like React's root. */
export function buildHostRootFiber(children: Fiber[] = []): Fiber {
    const hostRoot = buildFiber(null, { children })

    hostRoot.stateNode = { current: hostRoot, containerInfo: {} }
    children.forEach((childFiber) => {
        childFiber.return = hostRoot
    })

    return hostRoot
}

export function buildHostFiber(tagName: string, options: FiberOptions = {}): Fiber {
    return buildFiber(tagName, { ...options, stateNode: document.createElement(tagName) })
}

export function namedComponent(name: string): () => void {
    const component = () => undefined

    Object.defineProperty(component, 'name', { value: name })

    return component
}
