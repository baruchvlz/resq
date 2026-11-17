import type { ResqDomNode } from '../types'

const ELEMENT_NODE_TYPE = 1
const TEXT_NODE_TYPE = 3

function readNodeType(value: unknown): unknown {
    return typeof value === 'object' && value !== null ? (value as { nodeType?: unknown }).nodeType : undefined
}

/** Checks the node type instead of using `instanceof`, so it also works across iframes and for SVG. */
export function isElement(value: unknown): value is Element {
    return readNodeType(value) === ELEMENT_NODE_TYPE
}

export function isDomNode(value: unknown): value is ResqDomNode {
    const nodeType = readNodeType(value)

    return nodeType === ELEMENT_NODE_TYPE || nodeType === TEXT_NODE_TYPE
}
