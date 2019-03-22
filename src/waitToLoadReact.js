/**
 * @internal
 */

export function waitToLoadReact(timeout = 5000, rootElSelector) {
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

        const tryToFindApp = () => {
            const reactRoot = findReactRoot()

            if (reactRoot) {
                global.isReactLoaded = true
                global.rootReactElement = reactRoot._reactRootContainer._internalRoot.current
                return resolve()
            }

            if (timedout) {
                return
            }

            setTimeout(tryToFindApp, 200)
        }

        tryToFindApp()

        setTimeout(() => {
            timedout = true

            reject('Timed out')
        }, timeout)
    })
}
