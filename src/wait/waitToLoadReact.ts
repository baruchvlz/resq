import { ResqError } from '../errors'
import { getLoadedRootFiber, setLoadedRootFiber } from '../root/rootStore'
import { locateRootFiber } from './locateRootFiber'

const POLL_INTERVAL_IN_MS = 200
const DEFAULT_TIMEOUT_IN_MS = 5000

/**
 * Waits until a React app is rendered in the page and remembers its root, so queries can be run
 * without passing an element.
 *
 * @param timeoutInMs how long to wait before rejecting with a `WAIT_TIMEOUT` {@link ResqError}
 * @param rootElementSelector CSS selector of the root container, to skip searching the document
 */
export function waitToLoadReact(
    timeoutInMs: number = DEFAULT_TIMEOUT_IN_MS,
    rootElementSelector?: string,
): Promise<void> {
    if (getLoadedRootFiber()) {
        return Promise.resolve()
    }

    return new Promise<void>((resolve, reject) => {
        let pollHandle: ReturnType<typeof setTimeout> | undefined

        const timeoutHandle = setTimeout(() => {
            clearTimeout(pollHandle)
            reject(new ResqError('WAIT_TIMEOUT', `Timed out after ${timeoutInMs}ms waiting for React to load`))
        }, timeoutInMs)

        const pollForRoot = () => {
            const rootFiber = locateRootFiber(rootElementSelector)

            if (rootFiber) {
                clearTimeout(timeoutHandle)
                setLoadedRootFiber(rootFiber)
                resolve()

                return
            }

            pollHandle = setTimeout(pollForRoot, POLL_INTERVAL_IN_MS)
        }

        pollForRoot()
    })
}
