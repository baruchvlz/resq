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

    if (typeof element.type === 'function' &&
        element.child &&
        element.child.stateNode instanceof HTMLElement
    ) {
        return element.child.stateNode
    }
}

export function removeChildrenFromProps(props) {
    if (!props) {
        return props
    }

    const returnProps = {}

    for(let key in props) {
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

    tree = {
        ...tree,
        name: getElementType(elementCopy.type),
        node: findStateNode(elementCopy),
        props: removeChildrenFromProps(elementCopy.memoizedProps),
        state: getElementState(elementCopy.memoizedState),
    }

    // must verify if the elementCopy.type is a function and assume it's a react instance
    // if it's a react instance then we must take the first child's node as the instance's HTML
    // and continue adding the children based off the child's child
    if (typeIsFunction(elementCopy.type)) {
        elementCopy.child = elementCopy.child && elementCopy.child.child
    }

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
