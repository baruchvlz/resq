import deepEqual from 'fast-deep-equal'

const { isArray } = Array
const { keys } = Object

// One liner helper functions
function isFunction(type) {
    return typeof type === 'function'
}

function isHTMLOrText(node) {
    return node instanceof HTMLElement || node instanceof Text
}

function getElementName(type) {
    return isFunction(type) ? type.name : type
}

function isFragmentInstance(element) {
    return (element.children.length > 1)
}

function isNativeObject(obj) {
    return (typeof obj === 'object' && !isArray(obj))
}

function findStateNode (element) {
    if (isHTMLOrText(element.stateNode)) {
        return element.stateNode
    }

    if (element.child && isHTMLOrText(element.child.stateNode)) {
        return element.child.stateNode
    }

    return null
}

/**
 * @name removeChildrenFromProps
 * @param Object | String
 * @return Object | String
 * @description Remove the `children` property from the props since they will be available
 *              in the node
 */
function removeChildrenFromProps(props) {
    // if the props is a string, we can assume that it's just the text inside a html element
    if (!props || typeof props === 'string') {
        return props
    }

    const returnProps = { ...props }

    delete returnProps.children

    return returnProps
}

/**
  * @name verifyIfArraysMatch
  * @param macther Array - this is the Array that will be looped
  * @param verify Array - this is the Array to match against
  * @param exact - deep equal matcher
  * @return boolean
  */

export function verifyIfArraysMatch(arr1, arr2, exact = false) {
    if (!isArray(arr1) || !isArray(arr2)) {
        return false
    }

    if (exact) {
        if (arr1.length !== arr2.length) {
            return false
        }

        return !(arr1.find(item => !arr2.includes(item)))
    }

    return arr1.some(item => arr2.includes(item))
}

/**
  * @name verifyIfObjectsMatch
  * @param macther Object - this is the object that will be looped
  * @param verify Object - this is the object to match against
  * @param exact - deep equal matcher
  * @return boolean
  */
export function verifyIfObjectsMatch(matcher = {}, verify = {}, exact = false) {
    let results = []

    if (!keys(matcher).length) {
        return true
    }

    if (exact) {
        return deepEqual(matcher, verify)
    }

    keys(matcher).forEach((key) => {
        if (verify.hasOwnProperty(key)) {
            if (isNativeObject(matcher[key]) && isNativeObject(verify[key])) {
                results = results.concat(verifyIfObjectsMatch(matcher[key], verify[key]))
            }

            if (matcher[key] === verify[key] || verifyIfArraysMatch(matcher[key], verify[key])) {
                results.push(verify)
            }
        }
    })

    return !!(results.filter(el => el).length)
}

/**
 * @name getElementState
 * @param Object
 * @return Object | undefined
 * @description Class components store the state in `memoizedState`, but functional components
 *              using hooks store them in `memoizedState.baseState`
 */

function getElementState(elementState) {
    if (!elementState) {
        return undefined
    }

    const { baseState } = elementState

    if (baseState) {
        return baseState
    }

    return elementState
}
/**
 * @name buildFragmentNodeArray
 * @param Object
 * @return Array<HTMLElement | empty>
 * @description Creates an array of the tree's children HTML nodes
 */
export function buildFragmentNodeArray(tree) {
    return tree.children.map(child => child.node).filter(child => !!child)
}

/**
 * @name buildNodeTree
 * @param Object
 * @return Object
 * @description Build a node tree based on React virtual dom
 * @example
    {
      name: 'MyComponent',
      props: { hello: 'world' },
      children: [],
      state: { init: true },
      isFragment: false,
    }
 */
export function buildNodeTree(element) {
    let tree = { children: [] }

    if (!element) {
        return tree
    }

    tree.name = getElementName(element.type)
    tree.props = removeChildrenFromProps(element.memoizedProps)
    tree.state = getElementState(element.memoizedState)

    let { child } = element

    if (child) {
        tree.children.push(child)

        while (child.sibling) {
            tree.children.push(child.sibling)
            child = child.sibling
        }
    }

    tree.children = tree.children.map(child => buildNodeTree(child))

    if (isFunction(element.type) && isFragmentInstance(tree)) {
        tree.node = buildFragmentNodeArray(tree)
        tree.isFragment = true
    } else {
        tree.node = findStateNode(element)
    }

    return tree
}

/**
 * @name findInTree
 * @param Object
 * @param Function
 * @param Boolean - default false
 * @return Array<Object>
 * @description Iterate over the tree param and return matches from the passed function
 */

export function findInTree(stack, searchFn, selectFirst = false) {
    let returnArray = []

    while (stack.length || (selectFirst && !returnArray.length)) {
        const { children } = stack.shift()

        if(children && children.length) {
            children.forEach((child) => {
                if (searchFn(child)) {
                    returnArray.push(child)
                }

                stack.push(child)
            })
        }
    }

    return returnArray
}

/**
 * @name findSelectorInTree
 * @param Array<String>
 * @param Object
 * @param Boolean - default false
 * @param Function
 * @return Object
 * @description Base iterator function for the library. Iterates over selectors and searches
 *              node tree
 */
export function findSelectorInTree(selectors, tree, selectFirst = false, searchFn) {
    let treeArray = [tree]

    selectors.forEach((selector) => {
        treeArray = findInTree(treeArray, (child) => {
            if (searchFn && typeof searchFn === 'function') {
                return searchFn(child)
            }

            return child.name === selector
        }, selectFirst)
    })

    return treeArray
}

/**
 * @name filterNodesBy
 * @param Array<Object>
 * @param String
 * @param Any
 * @return Array<Objects>
 * @description Filter nodes by deep matching the node[key] to the obj
 */
export function filterNodesBy(nodes, key, matcher, exact = false) {
    if (isFunction(matcher)) {
        // eslint-disable-next-line no-console
        console.warn('Functions are not supported as filter matchers')
        return []
    }

    return nodes.filter(node => 
        (isNativeObject(matcher) && verifyIfObjectsMatch(matcher, node[key], exact)) ||
        (isArray(matcher) && verifyIfArraysMatch(matcher, node[key], exact)) ||
        (node[key] === matcher)
    ) 
}
