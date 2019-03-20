export function waitToLoadReact(timeout, rootElSelector) {
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

    return (() => new Promise((resolve, reject) => {
        let timedout = false

        const tryToFindApp = () => {
            const reactRoot = findReactRoot()

            if (reactRoot) {
                return resolve(reactRoot._reactRootContainer._internalRoot.current)
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
    }))()
}
