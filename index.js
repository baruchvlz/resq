import ReactSelector from './src/resq'
import { waitToLoadReact } from './src/waitToLoadReact'

export const resq$ = async (selector) => {
    if (!global.reactVersion) {
        try {
            await waitToLoadReact(5000)
        } catch (error) {
            throw new Error('Error while looking for React Component %s', selector, error)
        }
    }

    return new ReactSelector(selector).find()
}

export const resq$$ = async (selector) => {
    if (!global.reactVersion) {
        try {
            await waitToLoadReact(5000)
        } catch (error) {
            throw new Error('Error while looking for React Component %s', selector, error)
        }
    }

    return new ReactSelector(selector).findAll()
}
