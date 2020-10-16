import { findReactInstance } from './utils'

export function waitToLoadReact(timeout = 5000, rootElSelector: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
    if (global.isReactLoaded) {
        return Promise.resolve('React already loaded')
    }

    const findReactRoot = () => {
        const walker = document.createTreeWalker(document)

        if (rootElSelector) {
            return document.querySelector(rootElSelector)
        }

        while(walker.nextNode()) {
            if (walker.currentNode.hasOwnProperty('_reactRootContainer')) {
                return walker.currentNode
            }
        }
    }

    return new Promise((resolve: any, reject: any) => {
        let timedout = false

        const tryToFindApp = () => {
            const reactRoot = findReactRoot()

            if (reactRoot) {
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
                global.isReactLoaded = true
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'global'.
                global.rootReactElement = findReactInstance(reactRoot)
                return resolve()
            }
            /* istanbul ignore next */
            if (timedout) {
                return
            }

            setTimeout(tryToFindApp, 200)
        }

        tryToFindApp()

        /* istanbul ignore next */
        setTimeout(() => {
            timedout = true

            reject('Timed out')
        }, timeout)
    })
}
