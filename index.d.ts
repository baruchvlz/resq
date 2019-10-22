type NotFunc<T> = Exclude<T, Function>

declare namespace RESQ {
    interface RESQNode {
        name: 'MyComponent',
        node: HTMLElement | null,
        isFragment: boolean,
        state: NotFunc<any>,
        props: {},
        children: RESQNode[]
        private _nodes: Array<RESQ>
    }

    type waitToLoadReact = (timeInMs: number) => Promise
    type resq$ = (selector: string, element?: HTMLElement) => RESQNode
    type resq$$ = (selector: string, element?: HTMLElement) => Array<RESQNode>
}

declare var resq$: RESQ.resq$
declare var resq$$: RESQ.resq$
declare module "resq" {
    export = RESQ
}
