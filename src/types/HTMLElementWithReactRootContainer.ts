export interface HTMLElementWithReactRootContainer extends HTMLElement {
  _reactRootContainer: {_internalRoot: {current: any}};
  [key: string]: any;
}
