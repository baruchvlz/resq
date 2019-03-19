export const REACT_VERSION_MATCHERS = {
    V16: '_reactRootContainer',
    SSR: '_reactListenersID',
}

export function waitToLoadReact(timeout) {
    const isReact16 = () => {
        const walker = document.createTreeWalker(document)

        while(walker.nextNode()) {
            if (walker.currentNode.hasOwnProperty(REACT_VERSION_MATCHERS.V16)) {
                return REACT_VERSION_MATCHERS.V16
            }
        }
    }

    const hasReactHandler = () => {
        const handlerExists = !!Object.keys(document)
            .filter(prop => prop.startsWith(REACT_VERSION_MATCHERS.SSR)).length

        if (handlerExists) {
            return REACT_VERSION_MATCHERS.SSR
        }
    }

    const hasReactVersion = () => (isReact16() || hasReactHandler())

    return (() => new Promise((resolve, reject) => {
        let timedout = false

        const tryToFindApp = () => {
            const reactVersion = hasReactVersion()

            if (reactVersion) {
                global.reactVersion = reactVersion

                return resolve(true)
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
