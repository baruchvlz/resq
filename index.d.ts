type NotFunc<T> = Exclude<T, Function>

declare namespace RESQ {
    interface RESQNode {
        name: string,
        node: HTMLElement | null,
        isFragment: boolean,
        state: NotFunc<any>,
        props: {},
        children: RESQNode[]
        _nodes: Array<RESQNode>
    }

    type waitToLoadReact = (timeInMs?: number, rootElSelector?: string) => Promise<null | string>
    type resq$ = (selector: string, element?: HTMLElement) => RESQNode
    type resq$$ = (selector: string, element?: HTMLElement) => Array<RESQNode>
}

declare var resq$: RESQ.resq$
declare var resq$$: RESQ.resq$$
declare module "resq" {
    export = RESQ
}
