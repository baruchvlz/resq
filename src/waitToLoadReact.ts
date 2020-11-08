import { findReactInstance } from './utils'

export function waitToLoadReact(timeout = 5000, rootElSelector: string): HTMLElement | Promise<string> {
    if (window.isReactLoaded) {
        return Promise.resolve('React already loaded')
    }

    const findReactRoot = () => {
        const walker = document.createTreeWalker(document)

        if (rootElSelector) {
            return document.querySelector(rootElSelector)
        }

        while(walker.nextNode()) {
            // eslint-disable-next-line no-prototype-builtins
            if (walker.currentNode.hasOwnProperty('_reactRootContainer')) {
                return walker.currentNode
            }
        }
    }

    return new Promise((resolve: Function, reject: Function) => {
        let timedout = false

        const tryToFindApp = () => {
            const reactRoot = findReactRoot()

            if (reactRoot) {
                window.isReactLoaded = true
                const reactInstance = findReactInstance(reactRoot);

                if (reactInstance){
                    window.rootReactElement = reactInstance;
                }
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
