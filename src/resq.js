import { filterNodesBy, findSelectorInTree, buildNodeTree } from './utils'

class RESQNodes extends Array {
    constructor(nodes) {
        super(...nodes)
    }

    byProps(props) {
        return filterNodesBy(this, 'props', props)
    }

    byState(state) {
        return filterNodesBy(this, 'state', state)
    }
}

class RESQNode extends Object {
    constructor(item, nodes) {
        super(item)
        this.nodes = nodes

        for(let key in item) {
            this[key] = item[key]
        }
    }

    byProps(props) {
        return filterNodesBy(this.nodes, 'props', props)[0]
    }

    byState(state) {
        return filterNodesBy(this.nodes, 'state', state)[0]
    }
}

export default class RESQ {
    static getRootComponent() {
        const element = document.querySelector('#root')

        return element._reactRootContainer._internalRoot.current
    }

    constructor(selector) {
        this.selectors = selector.split(' ').filter(el => !!el).map(el => el.trim())
        this.rootComponent = RESQ.getRootComponent()
        this.tree = buildNodeTree(this.rootComponent)
    }

    find() {
        this.nodes = new RESQNodes(findSelectorInTree(this.selectors, this.tree))

        return new RESQNode(this.nodes[0], this.nodes)
    }

    findAll() {
        return new RESQNodes(findSelectorInTree(this.selectors, this.tree))
    }
}
