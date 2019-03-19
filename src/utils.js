import deepEqual from 'fast-deep-equal'

export function getElementType(type) {
    if (typeof type === 'string') {
        return type
    }

    if (typeof type === 'function') {
        return type.name
    }
}

function findStateNode (element) {
    if (element.stateNode instanceof HTMLElement) {
        return element.stateNode
    }

    if (typeof element.type === 'function' &&
        element.child &&
        element.child.stateNode instanceof HTMLElement
    ) {
        return element.child.stateNode
    }
}

export function buildNodeTree(element) {
    let tree = { children: [] }
    if (!element) {
        return tree
    }
    tree.name = getElementType(element.type)
    tree.node = findStateNode(element)
    tree.props = { ...element.memoizedProps }
    tree.state = { ...element.memoizedState }

    if (element.child) {
        tree.children.push(element.child)

        let child = element.child

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
