import { filterNodesBy, type FilterKey } from '../filter/filterNodes'
import {
    findFirstDescendantDomNode,
    isFragment,
    listChildFibers,
    readDomNode,
    readProps,
    readState,
} from '../fiber/readFiber'
import { resolveTypeName } from '../fiber/typeName'
import type { Fiber, FilterOptions, RESQNode, RESQNodes, ResqNodeTarget } from '../types'

type FilterMatcher = Parameters<RESQNode['byProps']>[0]

const fiberByNode = new WeakMap<RESQNode, Fiber>()

export class ResqNodeList extends Array<RESQNode> implements RESQNodes {
    // map / filter / slice return plain arrays instead of re-running this class's constructor
    static override get [Symbol.species](): ArrayConstructor {
        return Array
    }

    static fromNodes(nodes: readonly RESQNode[]): ResqNodeList {
        const nodeList = new ResqNodeList()

        for (const node of nodes) {
            nodeList.push(node)
        }

        return nodeList
    }

    byProps(props: FilterMatcher, options?: FilterOptions): ResqNodeList {
        return ResqNodeList.fromNodes(filterNodesBy(this, 'props', props, options))
    }

    byState(state: FilterMatcher, options?: FilterOptions): ResqNodeList {
        return ResqNodeList.fromNodes(filterNodesBy(this, 'state', state, options))
    }
}

function resolveNodeTarget(fiber: Fiber): ResqNodeTarget {
    const domNode = readDomNode(fiber)

    return domNode ?? findFirstDescendantDomNode(fiber)
}

/**
 * Materializes a fiber into a `RESQNode`. `node` and `children` are resolved on first access, so
 * a query only pays for the nodes the caller actually looks at.
 *
 * @param candidateNodes the nodes `byProps` / `byState` filter among. Filtering returns a node that
 *                       carries the filtered candidates, so filters can be chained.
 */
export function createResqNode(fiber: Fiber, candidateNodes: () => readonly RESQNode[]): RESQNode {
    let resolvedTarget: ResqNodeTarget | undefined
    let resolvedChildren: RESQNode[] | undefined

    function filterCandidates(key: FilterKey, matcher: FilterMatcher, options?: FilterOptions): RESQNode | undefined {
        const filteredNodes = filterNodesBy(candidateNodes(), key, matcher, options)
        const [firstNode] = filteredNodes

        if (!firstNode) {
            return undefined
        }

        return createResqNode(fiberByNode.get(firstNode) as Fiber, () => filteredNodes)
    }

    const resqNode = {
        name: resolveTypeName(fiber.type),
        isFragment: isFragment(fiber),
        props: readProps(fiber),
        state: readState(fiber),
        get node(): ResqNodeTarget {
            resolvedTarget ??= resolveNodeTarget(fiber)

            return resolvedTarget
        },
        get children(): RESQNode[] {
            if (!resolvedChildren) {
                // `byProps` / `byState` on a child filter among its siblings
                const childNodes: RESQNode[] = []

                for (const childFiber of listChildFibers(fiber)) {
                    childNodes.push(createResqNode(childFiber, () => childNodes))
                }

                resolvedChildren = childNodes
            }

            return resolvedChildren
        },
        byProps: (props: FilterMatcher, options?: FilterOptions) => filterCandidates('props', props, options),
        byState: (state: FilterMatcher, options?: FilterOptions) => filterCandidates('state', state, options),
    }

    fiberByNode.set(resqNode as unknown as RESQNode, fiber)

    return resqNode as unknown as RESQNode
}
