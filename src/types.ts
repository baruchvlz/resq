/**
 * Minimal structural view of a React Fiber. resq only reads these fields, so it does not depend
 * on React's internal types and works across React 16 to 19.
 */
export interface Fiber {
    type?: unknown
    memoizedProps?: unknown
    memoizedState?: unknown
    stateNode?: unknown
    child?: Fiber | null
    sibling?: Fiber | null
    return?: Fiber | null
    /** React keeps two versions of each fiber (current and work-in-progress). */
    alternate?: Fiber | null
}

/** A DOM node that a React component rendered. */
export type ResqDomNode = Element | Text

/**
 * The DOM node(s) of a component:
 * - the rendered element for host components and components with a single host child,
 * - an array of nodes for components that render several siblings (fragments),
 * - `null` when the component rendered no DOM node.
 */
export type ResqNodeTarget = ResqDomNode | ResqDomNode[] | null

export interface FilterOptions {
    /** Compare with deep equality instead of partial matching. Defaults to `false`. */
    exact?: boolean
}

export interface RESQNode<TProps = Record<string, unknown>, TState = unknown> {
    /** Component name. Host elements use their tag name (e.g. `div`). */
    name: string | undefined
    /** Rendered DOM node(s). Resolved lazily on first access. */
    readonly node: ResqNodeTarget
    /** `true` when the component renders several sibling nodes. */
    isFragment: boolean
    state: TState
    /** Props without `children`. Text children carry their string content. */
    props: TProps
    /** Child nodes. Resolved lazily on first access. */
    readonly children: RESQNode[]
    /**
     * Narrows the matches of the query this node came from to the ones whose props match, and
     * returns the first. Returns `undefined` when none match.
     */
    byProps(props: object | unknown[] | string | number | boolean | null, options?: FilterOptions): RESQNode<TProps, TState> | undefined
    /** Same as {@link RESQNode.byProps} but matching on state. */
    byState(state: object | unknown[] | string | number | boolean | null, options?: FilterOptions): RESQNode<TProps, TState> | undefined
}

export interface RESQNodes<TProps = Record<string, unknown>, TState = unknown>
    extends Array<RESQNode<TProps, TState>> {
    /** Keeps the nodes whose props match. */
    byProps(props: object | unknown[] | string | number | boolean | null, options?: FilterOptions): RESQNodes<TProps, TState>
    /** Keeps the nodes whose state match. */
    byState(state: object | unknown[] | string | number | boolean | null, options?: FilterOptions): RESQNodes<TProps, TState>
}
