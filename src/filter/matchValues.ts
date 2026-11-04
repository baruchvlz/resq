import deepEqual from 'fast-deep-equal'

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Arrays match when they share at least one item, or, when `exact`, when they have the same
 * length and every item of `matcherItems` is in `targetItems`.
 */
export function arraysMatch(matcherItems: unknown, targetItems: unknown, exact = false): boolean {
    if (!Array.isArray(matcherItems) || !Array.isArray(targetItems)) {
        return false
    }

    if (exact) {
        return matcherItems.length === targetItems.length
            && matcherItems.every(item => targetItems.includes(item))
    }

    return matcherItems.some(item => targetItems.includes(item))
}

/**
 * Partial match: every key of `matcher` that also exists in `target` must match. Nested objects
 * are matched recursively and arrays by overlap. With `exact` the objects must be deeply equal.
 */
export function objectsMatch(matcher: Record<string, unknown>, target: unknown, exact = false): boolean {
    const matcherKeys = Object.keys(matcher)

    if (matcherKeys.length === 0) {
        return true
    }

    if (!isPlainObject(target) || Object.keys(target).length === 0) {
        return false
    }

    if (exact) {
        return deepEqual(matcher, target)
    }

    const sharedKeys = matcherKeys.filter(key => key in target)

    return sharedKeys.length > 0 && sharedKeys.every((key) => {
        const matcherValue = matcher[key]
        const targetValue = target[key]

        if (isPlainObject(matcherValue) && isPlainObject(targetValue)) {
            return objectsMatch(matcherValue, targetValue)
        }

        return matcherValue === targetValue || arraysMatch(matcherValue, targetValue)
    })
}
