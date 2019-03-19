import { filterBy, searchTree, buildNodeTree } from './utils'

class RESQNodes extends Array {
    constructor(nodes) {
        super(...nodes)
    }

    byProps(props) {
        return filterBy(this, 'props', props)
    }

    byState(state) {
        return filterBy(this, 'state', state)
    }
}

class RESQNode extends Object {
    constructor(item, resq) {
        super(item)

        this.resq = resq

        for(let key in item) {
            this[key] = item[key]
        }
    }

    byProps(props) {
        return filterBy(this.resq.nodes, 'props', props)[0]
    }

    byState(state) {
        return filterBy(this.resq.nodes, 'state', state)[0]
    }
}

export default class RESQ {
    constructor(selector) {
        this.selectors = selector.split(' ').filter(el => !!el).map(el => el.trim())
        this.rootComponent = (document.querySelector('#root')).
            _reactRootContainer._internalRoot.current
        this.tree = buildNodeTree(this.rootComponent)
    }

    find() {
        this.nodes = new RESQNodes(searchTree(this.selectors, this.tree))

        return new RESQNode(this.nodes[0])
    }

    findAll() {
        this.nodes = undefined

        return new RESQNodes(searchTree(this.selectors, this.tree))
    }
}
