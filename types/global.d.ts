export declare global {
  interface Window {
    isReactLoaded: boolean;
    rootReactElement: PartialReactInstance; // FIXME type
  }

  type NotFunction<T> = T extends Function ? never : T;

  // React does not expose the FiberNode type.
  // Properties defined here are the ones we use from 
  // the FiberNode.
  interface PartialReactInstance extends HTMLElement {
    child: PartialReactInstance | null;
    sibling: PartialReactInstance | null;
    memoizedProps: Object;
    memoizedState: Object;
    tag: number;
    type: string | Function;
  }
}
