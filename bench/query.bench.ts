import { bench, describe } from 'vitest'
import { ReactSelectorQuery } from '../src/query/ReactSelectorQuery'
import type { Fiber } from '../src/types'
import BaselineQuery from './baseline-v1/resq'

const COMPONENT_VARIETY = 40

function buildComponentTypes(): Array<() => void> {
    return Array.from({ length: COMPONENT_VARIETY }, (_unused, componentIndex) => {
        const component = () => undefined

        Object.defineProperty(component, 'name', { value: `Item${componentIndex}` })

        return component
    })
}

/**
 * Builds a fiber tree with `breadth` children per fiber and `depth` levels, mixing components and
 * host elements the way a real app does.
 */
function buildLargeTree(breadth: number, depth: number): { rootFiber: Fiber; fiberCount: number } {
    const componentTypes = buildComponentTypes()
    let fiberCount = 0

    function buildLevel(level: number): Fiber {
        fiberCount++
        const isComponent = level % 2 === 0
        const type = isComponent ? componentTypes[fiberCount % COMPONENT_VARIETY] : 'div'
        const fiber: Fiber = {
            type: level === depth ? 'span' : type,
            memoizedProps: { level, id: fiberCount },
            memoizedState: isComponent ? { baseState: { open: level % 4 === 0 } } : null,
            stateNode: isComponent ? null : document.createElement('div'),
            child: null,
            sibling: null,
        }

        if (level < depth) {
            let previous: Fiber | undefined

            for (let childIndex = 0; childIndex < breadth; childIndex++) {
                const child = buildLevel(level + 1)

                if (previous) {
                    previous.sibling = child
                } else {
                    fiber.child = child
                }

                previous = child
            }
        }

        return fiber
    }

    return { rootFiber: buildLevel(0), fiberCount }
}

const trees = [
    { label: '~10k fibers', ...buildLargeTree(10, 4) },
    { label: '~110k fibers', ...buildLargeTree(10, 5) },
]

for (const { label, rootFiber } of trees) {
    describe(`find the first match (${label})`, () => {
        bench('v1', () => {
            new BaselineQuery('Item3', rootFiber).find()
        })

        bench('v2', () => {
            new ReactSelectorQuery('Item3', rootFiber).find()
        })
    })

    describe(`find all matches with a wildcard (${label})`, () => {
        bench('v1', () => {
            new BaselineQuery('Item1*', rootFiber).findAll()
        })

        bench('v2', () => {
            new ReactSelectorQuery('Item1*', rootFiber).findAll()
        })
    })

    describe(`descendant chain (${label})`, () => {
        bench('v1', () => {
            new BaselineQuery('Item2 Item4', rootFiber).findAll()
        })

        bench('v2', () => {
            new ReactSelectorQuery('Item2 Item4', rootFiber).findAll()
        })
    })
}
