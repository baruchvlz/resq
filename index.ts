import { ReactSelectorQuery, ReactSelectorQueryNode, ReactSelectorQueryNodes } from './src/resq';
import { waitToLoadReact } from './src/waitToLoadReact';
import { findReactInstance } from './src/utils';
import { PartialReactInstance } from './src/types/PartialReactInstance';

function doQuery(selector: string, method: 'find' | 'findAll', element?: HTMLElement) {
    if (!element && !window.isReactLoaded) {
        throw new Error('Could not find the root element of your application')
    }

    let reactInstance: PartialReactInstance | undefined = window.rootReactElement;

    if (element instanceof HTMLElement) {
        reactInstance = findReactInstance(element)
    }

    if (!reactInstance) {
        throw new Error('Could not find instance of React in given element')
    }

    return new ReactSelectorQuery(selector, reactInstance)[method]()
}

export function resq$(selector: string, element: HTMLElement): ReactSelectorQueryNode {
    return doQuery(selector, 'find', element) as ReactSelectorQueryNode;
}

export function resq$$(selector: string, element: HTMLElement): ReactSelectorQueryNodes {
    return doQuery(selector, 'findAll', element) as ReactSelectorQueryNodes;
}

export { waitToLoadReact }
