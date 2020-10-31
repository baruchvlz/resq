import { RESQNode } from '../types';
import { filterNodesBy, findSelectorInTree, buildNodeTree, splitSelector } from './utils'

export class ReactSelectorQueryNodes extends Array {
    public nodes: ReactSelectorQueryNode[] = [];

    byProps(props: NotFunction<any>, { exact }: { exact: boolean } = { exact: false }): ReactSelectorQueryNodes {
        const filtered = filterNodesBy(this, 'props', props, exact)

        return new ReactSelectorQueryNodes(filtered)

    }

    byState(state: NotFunction<any>, { exact }: { exact: boolean } = { exact: false }): ReactSelectorQueryNodes {
        const filtered = filterNodesBy(this, 'state', state, exact)

        return new ReactSelectorQueryNodes(filtered)
    }
}

export class ReactSelectorQueryNode extends Object {
    constructor(item: Object, private nodes: ReactSelectorQueryNodes) {
        super(item)

        for (let key in item) {
            // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
            this[key] = item[key]
        }
    }

    byProps(props: NotFunction<any>, { exact }: { exact: boolean } = { exact: false }): ReactSelectorQueryNode {
        const filtered = filterNodesBy(this.nodes, 'props', props, exact)[0]

        return new ReactSelectorQueryNode(filtered, this.nodes)
    }

    byState(state: NotFunction<any>, { exact }: { exact: boolean } = { exact: false }): ReactSelectorQueryNode {
        const filtered = filterNodesBy(this.nodes, 'state', state, exact)[0]

        return new ReactSelectorQueryNode(filtered, this.nodes)
    }
}

export class ReactSelectorQuery {
    private tree: RESQNode = buildNodeTree(this.root);
    private nodes: ReactSelectorQueryNodes = new ReactSelectorQueryNodes(
        findSelectorInTree(splitSelector(this.selector), this.tree, true),
    )

    constructor(public selector: string, private root: PartialReactInstance) { }

    find() {
        return new ReactSelectorQueryNode(this.nodes[0], this.nodes)
    }

    findAll() {
        return new ReactSelectorQueryNodes(findSelectorInTree(splitSelector(this.selector), this.tree))
    }
}
