import { PartialReactInstance } from '../src/types/PartialReactInstance';

export declare global {
  interface Window {
    isReactLoaded: boolean;
    rootReactElement: PartialReactInstance; // FIXME type
  }

  type NotFunction<T> = T extends Function ? never : T;
}
