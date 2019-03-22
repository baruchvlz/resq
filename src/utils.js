import deepEqual from 'fast-deep-equal'

function typeIsFunction(type) {
    return typeof type === 'function'
}

export function getElementType(type) {
    return typeIsFunction(type) ? type.name : type
}

function findStateNode (element) {
    if (element.stateNode instanceof HTMLElement) {
        return element.stateNode
    }

    if (typeof element.type === 'function') {
        return null
    }
}

export function removeChildrenFromProps(props) {
    // if the props is a string, we can assume that it's just the text inside a html element
    if (!props || typeof props === 'string') {
        return props
    }

    const returnProps = {}

    for(let key in props) {
        // remove children prop since it'll be an array in the RESQNode instance
        if (key !== 'children') {
            returnProps[key] = props[key]
        }
    }

    return returnProps
}

export function getElementState(elementState) {
    if (!elementState) {
        return {}
    }

    const { baseState } = elementState

    if (baseState) {
        return baseState
    }

    return elementState
}

export function buildNodeTree(element) {
    let tree = { children: [] }
    let elementCopy = { ...element }
    if (!element) {
        return tree
    }

    tree.name = getElementType(elementCopy.type)
    tree.node = findStateNode(elementCopy)
    tree.props = removeChildrenFromProps(elementCopy.memoizedProps)
    tree.state = getElementState(elementCopy.memoizedState)

    if (elementCopy.child) {
        tree.children.push(elementCopy.child)

        let child = elementCopy.child

        while (child.sibling) {
            tree.children.push(child.sibling)
            child = child.sibling
        }
    }

    tree.children = tree.children.map(child => buildNodeTree(child))
    return tree
}

export function findInTree(tree, searchFn, selectFirst = false) {
    let returnArray = []
    let stack = tree

    while (stack.length || (selectFirst && !returnArray.length)) {
        const node = stack.shift()

        if(node.children && node.children.length) {
            for(let child of node.children) {
                if (searchFn(child)) {
                    returnArray.push(child)
                }

                stack.push(child)
            }
        }
    }

    return returnArray
}

export function findSelectorInTree(selectors, tree, selectFirst = false, searchFn) {
    let treeArray = [tree]

    selectors.forEach((selector) => {
        treeArray = findInTree(treeArray, child => {
            if (searchFn && typeof searchFn === 'function') {
                return searchFn(child)
            }

            return child.name === selector
        }, selectFirst)
    })

    return treeArray
}

export function filterNodesBy(nodes, key, obj) {
    const filtered = []

    const interator = el => {
        if (deepEqual(obj, el[key])) {
            filtered.push(el)
        }
    }

    nodes.forEach(interator)

    return filtered
}
