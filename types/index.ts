export interface RESQNode {
    name: string,
    node: HTMLElement | null,
    isFragment: boolean,
    state: NotFunction<any>,
    props: {},
    children: RESQNode[]
    // NOTE: _nodes should be private
    _nodes: Array<RESQNode>
}