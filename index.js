import ReactSelector from './src/resq'
import { waitToLoadReact } from './src/waitToLoadReact'

export const resq$ = async (selector, { timeout, rootElSelector } = { timeout: 5000 }) => {
    let root
    if (!global.reactVersion) {
        try {
            root = await waitToLoadReact(timeout, rootElSelector)
        } catch (error) {
            throw new Error('Could not find the root element of your application')
        }
    }

    return new ReactSelector(selector, root).find()
}

export const resq$$ = async (selector, { timeout, rootElSelector } = { timeout: 5000 }) => {
    let root
    if (!global.reactVersion) {
        try {
            root = await waitToLoadReact(timeout, rootElSelector)
        } catch (error) {
            throw new Error('Could not find the root element of your application')
        }
    }

    return new ReactSelector(selector, root).findAll()
}
