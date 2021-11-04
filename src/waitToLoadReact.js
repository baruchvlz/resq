import { findReactInstance } from './utils'

export function waitToLoadReact(timeout = 5000, rootElSelector) {
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

    return new Promise((resolve, reject) => {
        let timedout = false
        let timeoutHandler = null;

        const tryToFindApp = () => {
            const reactRoot = findReactRoot()

            if (reactRoot) {
                global.isReactLoaded = true
                global.rootReactElement = findReactInstance(reactRoot)

                if (global.rootReactElement) {
                    clearTimeout(timeoutHandler)
                    return resolve()
                }
            }
            /* istanbul ignore next */
            if (timedout) {
                return
            }

            setTimeout(tryToFindApp, 200)
        }

        tryToFindApp()

        /* istanbul ignore next */
        timeoutHandler = setTimeout(() => {
            timedout = true;
            reject("Timed out");
        }, timeout);
  });
}
