// React does not expose the FiberNode type.
// Properties defined here are the ones we use from
// the FiberNode.
export interface PartialReactInstance extends HTMLElement {
  child: PartialReactInstance | null;
  sibling: PartialReactInstance | null;
  memoizedProps: Object;
  memoizedState: Object;
  tag: number;
  type: string | Function;
}
