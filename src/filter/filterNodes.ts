import type { FilterOptions } from '../types'
import { arraysMatch, objectsMatch } from './matchValues'

export type FilterKey = 'props' | 'state'

/** Filters nodes by matching `node[key]` against `matcher`. */
export function filterNodesBy<TNode extends Record<FilterKey, unknown>>(
    nodes: readonly TNode[],
    key: FilterKey,
    matcher: unknown,
    { exact = false }: FilterOptions = {},
): TNode[] {
    if (typeof matcher === 'function') {
        throw new TypeError('Functions are not supported as filter matchers')
    }

    return nodes.filter((node) => {
        const target = node[key]

        if (Array.isArray(matcher)) {
            return arraysMatch(matcher, target, exact)
        }

        if (typeof matcher === 'object' && matcher !== null) {
            return objectsMatch(matcher as Record<string, unknown>, target, exact)
        }

        return target === matcher
    })
}
