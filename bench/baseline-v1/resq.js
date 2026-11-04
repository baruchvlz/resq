import { filterNodesBy, findSelectorInTree, buildNodeTree } from './utils'

class ReactSelectorQueryNodes extends Array {
    constructor(nodes) {
        if (!nodes) {
            nodes = []
        }

        super(...nodes)
    }

    byProps(props, { exact } = { exact: false }) {
        const filtered = filterNodesBy(this, 'props', props, exact)

        return new ReactSelectorQueryNodes(filtered)

    }

    byState(state, { exact } = { exact: false }) {
        const filtered = filterNodesBy(this, 'state', state, exact)

        return new ReactSelectorQueryNodes(filtered)
    }
}

class ReactSelectorQueryNode extends Object {
    constructor(item, nodes) {
        super(item)
        this._nodes = nodes

        for(let key in item) {
            this[key] = item[key]
        }
    }

    byProps(props, { exact } = { exact: false }) {
        const filtered = filterNodesBy(this._nodes, 'props', props, exact)[0]

        return new ReactSelectorQueryNode(filtered, this._nodes)
    }

    byState(state, { exact } = { exact: false }) {
        const filtered = filterNodesBy(this._nodes, 'state', state, exact)[0]

        return new ReactSelectorQueryNode(filtered, this._nodes)
    }
}

export default class ReactSelectorQuery {
    constructor(selector, root) {
        this.selectors = selector.split(' ').filter(el => !!el).map(el => el.trim())
        this.rootComponent = root
        this.tree = buildNodeTree(this.rootComponent)
    }

    find() {
        this.nodes = new ReactSelectorQueryNodes(
            findSelectorInTree(this.selectors, this.tree, true),
        )

        return new ReactSelectorQueryNode(this.nodes[0], this.nodes)
    }

    findAll() {
        return new ReactSelectorQueryNodes(findSelectorInTree(this.selectors, this.tree))
    }
}
