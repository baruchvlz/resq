import ReactSelector from './src/resq'
import { waitToLoadReact } from './src/waitToLoadReact'

export const resq$ = (selector) => {
    if (!global.isReactLoaded) {
        return 'Could not find the root element of your application'
    }

    return new ReactSelector(selector, global.rootReactElement).find()
}

export const resq$$ = (selector) => {
    if (!global.isReactLoaded) {
        return 'Could not find the root element of your application'
    }

    return new ReactSelector(selector, global.rootReactElement).findAll()
}

export { waitToLoadReact }
