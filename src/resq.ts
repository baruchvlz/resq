import { filterNodesBy, findSelectorInTree, buildNodeTree } from './utils'

class ReactSelectorQueryNodes extends Array {
    constructor(nodes: any) {
        if (!nodes) {
            nodes = []
        }

        super(...nodes)
    }

    byProps(props: any, { exact } = { exact: false }) {
        const filtered = filterNodesBy(this, 'props', props, exact)

        return new ReactSelectorQueryNodes(filtered)

    }

    byState(state: any, { exact } = { exact: false }) {
        const filtered = filterNodesBy(this, 'state', state, exact)

        return new ReactSelectorQueryNodes(filtered)
    }
}

class ReactSelectorQueryNode extends Object {
    _nodes: any;
    constructor(item: any, nodes: any) {
        super(item)
        this._nodes = nodes

        for(let key in item) {
            // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
            this[key] = item[key]
        }
    }

    byProps(props: any, { exact } = { exact: false }) {
        const filtered = filterNodesBy(this._nodes, 'props', props, exact)[0]

        return new ReactSelectorQueryNode(filtered, this._nodes)
    }

    byState(state: any, { exact } = { exact: false }) {
        const filtered = filterNodesBy(this._nodes, 'state', state, exact)[0]

        return new ReactSelectorQueryNode(filtered, this._nodes)
    }
}

export default class ReactSelectorQuery {
    nodes: any;
    rootComponent: any;
    selectors: any;
    tree: any;
    constructor(selector: any, root: any) {
        this.selectors = selector.split(' ').filter((el: any) => !!el).map((el: any) => el.trim())
        this.rootComponent = root
        this.tree = buildNodeTree(this.rootComponent)
    }

    find() {
        this.nodes = new ReactSelectorQueryNodes(
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
            findSelectorInTree(this.selectors, this.tree, true),
        )

        return new ReactSelectorQueryNode(this.nodes[0], this.nodes)
    }

    findAll() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
        return new ReactSelectorQueryNodes(findSelectorInTree(this.selectors, this.tree))
    }
}
