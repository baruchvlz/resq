import { parseSelector } from '../selector/parseSelector'
import type { NameMatcher } from '../selector/matchName'
import type { Fiber, RESQNode, RESQNodes } from '../types'
import { createResqNode, ResqNodeList } from './resultNodes'
import { searchFibers } from './searchFibers'

export class ReactSelectorQuery {
    private readonly segmentMatchers: NameMatcher[]

    constructor(selector: string, private readonly rootFiber: Fiber) {
        this.segmentMatchers = parseSelector(selector)
    }

    /** First match in breadth-first order, or `undefined`. Stops searching at the first match. */
    find(): RESQNode | undefined {
        const [firstFiber] = searchFibers(this.rootFiber, this.segmentMatchers, true)

        if (!firstFiber) {
            return undefined
        }

        // `byProps` / `byState` on a single result filter among every match of the query, which
        // is only searched for when one of them is called
        let allMatches: RESQNodes | undefined

        return createResqNode(firstFiber, () => {
            allMatches ??= this.findAll()

            return allMatches
        })
    }

    findAll(): RESQNodes {
        const nodeList = new ResqNodeList()

        for (const matchedFiber of searchFibers(this.rootFiber, this.segmentMatchers, false)) {
            nodeList.push(createResqNode(matchedFiber, () => nodeList))
        }

        return nodeList
    }
}
