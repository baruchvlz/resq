import { resolveTypeName } from '../fiber/typeName'
import type { NameMatcher } from '../selector/matchName'
import type { Fiber } from '../types'

function searchSegment(scopeFibers: Fiber[], matchesName: NameMatcher, stopAtFirstMatch: boolean): Fiber[] {
    const matchByType = new Map<unknown, boolean>()
    const matchedFibers: Fiber[] = []
    const queue = scopeFibers.slice()
    // several scopes can be nested in each other, so descendants could be reached twice
    const visitedFibers = scopeFibers.length > 1 ? new Set<Fiber>() : undefined

    for (let queueIndex = 0; queueIndex < queue.length; queueIndex++) {
        for (let child = (queue[queueIndex] as Fiber).child; child; child = child.sibling) {
            if (visitedFibers) {
                if (visitedFibers.has(child)) {
                    continue
                }

                visitedFibers.add(child)
            }

            let isMatch = matchByType.get(child.type)

            if (isMatch === undefined) {
                const name = resolveTypeName(child.type)

                isMatch = name !== undefined && matchesName(name)
                matchByType.set(child.type, isMatch)
            }

            if (isMatch) {
                matchedFibers.push(child)

                if (stopAtFirstMatch) {
                    return matchedFibers
                }
            }

            queue.push(child)
        }
    }

    return matchedFibers
}

/**
 * Resolves a descendant chain of selectors: each matcher searches below the matches of the
 * previous one, breadth first. Returns the matches of the last matcher.
 */
export function searchFibers(rootFiber: Fiber, segmentMatchers: NameMatcher[], stopAtFirstMatch: boolean): Fiber[] {
    let scopeFibers = [rootFiber]

    for (let segmentIndex = 0; segmentIndex < segmentMatchers.length; segmentIndex++) {
        const isLastSegment = segmentIndex === segmentMatchers.length - 1

        scopeFibers = searchSegment(
            scopeFibers,
            segmentMatchers[segmentIndex] as NameMatcher,
            isLastSegment && stopAtFirstMatch,
        )

        if (scopeFibers.length === 0) {
            return scopeFibers
        }
    }

    return scopeFibers
}
