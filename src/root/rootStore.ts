import type { Fiber } from '../types'

let loadedRootFiber: Fiber | undefined

/** The root fiber found by `waitToLoadReact`, used by queries that are not given an element. */
export function getLoadedRootFiber(): Fiber | undefined {
    return loadedRootFiber
}

export function setLoadedRootFiber(rootFiber: Fiber | undefined): void {
    loadedRootFiber = rootFiber
}
