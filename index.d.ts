type NotFunc<T> = Exclude<T, Function>

interface RESQNode {
  name: string,
  node: HTMLElement | null,
  isFragment: boolean,
  state: NotFunc<any>,
  props: {},
  children: RESQNode[]
  _nodes: Array<RESQNode>
}

export const waitToLoadReact: (timeInMs?: number, rootElSelector?: string) => Promise<null | string>
export const resq$: (selector: string, element?: HTMLElement) => RESQNode
export const resq$$: (selector: string, element?: HTMLElement) => Array<RESQNode>