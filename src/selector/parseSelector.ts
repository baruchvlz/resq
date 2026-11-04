import { ResqError } from '../errors'
import { compileNameMatcher, type NameMatcher } from './matchName'

/**
 * Splits a selector into its descendant chain (`'Parent Child'`) and compiles one name matcher
 * per segment.
 */
export function parseSelector(selector: string): NameMatcher[] {
    if (typeof selector !== 'string') {
        throw new ResqError('INVALID_SELECTOR', `The selector must be a string, received ${typeof selector}`)
    }

    const segments = selector.split(/\s+/).filter(segment => segment !== '')

    if (segments.length === 0) {
        throw new ResqError('INVALID_SELECTOR', 'The selector must contain at least one component name')
    }

    return segments.map(compileNameMatcher)
}
