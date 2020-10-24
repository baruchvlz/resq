import deepEqual from 'fast-deep-equal'

const { isArray } = Array
const { keys } = Object

// One liner helper functions
function isFunction(type: any) {
    return typeof type === 'function'
}

function isHTMLOrText(node: any) {
    return node instanceof HTMLElement || node instanceof Text
}

function getElementName(type: any) {
    return isFunction(type) ? type.name : type
}

function isFragmentInstance(element: any) {
    return (element.children.length > 1)
}

function isNativeObject(obj: any) {
    return (typeof obj === 'object' && !isArray(obj))
}

function findStateNode(element: any) {
    if (isHTMLOrText(element.stateNode)) {
        return element.stateNode
    }

    if (element.child && isHTMLOrText(element.child.stateNode)) {
        return element.child.stateNode
    }

    return null
}

export function stripHoCFromName(componentName?: string) {
    if (componentName) {
        const splitName = componentName.split('(')

        if (splitName.length === 1) {
            return componentName
        }

        return splitName.find((e: any) => e.includes(')'))?.replace(/\)*/g, '')
    }
}

/**
 * @name removeChildrenFromProps
 * @param {Object | String}
 * @return {Object | String}
 * @description Remove the `children` property from the props since they will be available
 *              in the node
 */
function removeChildrenFromProps(props: any) {
    // if the props is a string, we can assume that it's just the text inside a html element
    if (!props || typeof props === 'string') {
        return props
    }

    const returnProps = { ...props }

    delete returnProps.children

    return returnProps
}

/**
 * @name getElementState
 * @param {Object}
 * @return {Object} | undefined
 * @description Class components store the state in `memoizedState`, but functional components
 *              using hooks store them in `memoizedState.baseState`
 */
function getElementState(elementState: any) {
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
 * @name verifyIfArraysMatch
 * @param {Array} macther - this is the Array that will be looped
 * @param {Array} verify - this is the Array to match against
 * @param {Boolean} exact - deep equal matcher
 * @return {boolean}
 */
export function verifyIfArraysMatch(arr1: any, arr2: any, exact = false) {
    if (!isArray(arr1) || !isArray(arr2)) {
        return false
    }

    if (exact) {
        if (arr1.length !== arr2.length) {
            return false
        }

        return !(arr1.find((item: any) => !arr2.includes(item)))
    }

    return arr1.some(item => arr2.includes(item))
}

/**
 * @name verifyIfObjectsMatch
 * @param {Object} macther - this is the object that will be looped
 * @param {Object} verify - this is the object to match against
 * @param {Boolean} exact - deep equal matcher
 * @return boolean
 */
export function verifyIfObjectsMatch(matcher: Record<string, any> = {}, verify: any | null = {}, exact = false) {
    let results: any = []

    if (!keys(matcher).length) {
        return true
    }

    if (verify === null || !keys(verify).length) {
        return false
    }

    if (exact) {
        return deepEqual(matcher, verify)
    }

    const matchingKeys = keys(matcher).filter(key => keys(verify).includes(key))

    matchingKeys.forEach((key) => {
        if (isNativeObject(matcher[key]) && isNativeObject(verify[key])) {
            results = results.concat(verifyIfObjectsMatch(matcher[key], verify[key]))
        }

        if (matcher[key] === verify[key] || verifyIfArraysMatch(matcher[key], verify[key])) {
            results.push(verify)
        }
    })

    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'el' implicitly has an 'any' type.
    return results.length > 0 && results.filter(el => el).length === matchingKeys.length
}

/**
 * @name buildFragmentNodeArray
 * @param {Object}
 * @return {Array<HTMLElement | empty>}
 * @description Creates an array of the tree's children HTML nodes
 */
export function buildFragmentNodeArray(tree: any) {
    return tree.children.map((child: any) => child.node).filter((child: any) => !!child)
}

/**
 * @name buildNodeTree
 * @param {Object}
 * @return {Object}
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
export function buildNodeTree(element: any) {
    let tree = { children: [] }

    if (!element) {
        return tree
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type '{ children... Remove this comment to see the full error message
    tree.name = getElementName(element.type)
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'props' does not exist on type '{ childre... Remove this comment to see the full error message
    tree.props = removeChildrenFromProps(element.memoizedProps)
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{ childre... Remove this comment to see the full error message
    tree.state = getElementState(element.memoizedState)

    let { child } = element

    if (child) {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        tree.children.push(child)

        while (child.sibling) {
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
            tree.children.push(child.sibling)
            child = child.sibling
        }
    }

    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: never[]; }' is not assignable to... Remove this comment to see the full error message
    tree.children = tree.children.map(child => buildNodeTree(child))

    if (isFunction(element.type) && isFragmentInstance(tree)) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'node' does not exist on type '{ children... Remove this comment to see the full error message
        tree.node = buildFragmentNodeArray(tree)
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'isFragment' does not exist on type '{ ch... Remove this comment to see the full error message
        tree.isFragment = true
    } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'node' does not exist on type '{ children... Remove this comment to see the full error message
        tree.node = findStateNode(element)
    }

    return tree
}

function findNode(children: any) {
    while (children.length) {
        const child = children.shift()

        if (child.node) {
            return child.node
        }

        if (child.children && Array.isArray(child.children)) {
            children.push(...child.children)
        }
    }
}

/**
 * @name findInTree
 * @param {Object}
 * @param {Function}
 * @param {Boolean} - default false
 * @return {Array<Object>}
 * @description Iterate over the tree param and return matches from the passed function
 */

export function findInTree(stack: any, searchFn: any) {
    let returnArray: any = []

    while (stack.length) {
        const { children } = stack.shift()

        if (children && Array.isArray(children)) {
            children.forEach((child) => {
                if (searchFn(child)) {
                    if (!child.node && Array.isArray(child.children)) {
                        child.node = findNode(child.children.concat([]))
                    }

                    returnArray.push(child)
                }

                stack.push(child)
            })
        }
    }

    return returnArray
}

/**
 * @name matchSelector
 * @param {string} selector
 * @param {string} nodeName
 * @return {boolean}
 * @description Check is node name match to selector
 */
export function matchSelector(selector: any, nodeName: any) {
    const strippedName = stripHoCFromName(nodeName)
    const escapeRegex = (nodeName: any) => nodeName.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')

    return new RegExp('^' + selector.split('*')
        .map(escapeRegex).join('.+') + '$')
        .test(strippedName!)
}

/**
 * @name findSelectorInTree
 * @param {Array<String>}
 * @param {Object}
 * @param {Boolean} - default false
 * @param {Function}
 * @return {Object}
 * @description Base iterator function for the library. Iterates over selectors and searches
 *              node tree
 */
export function findSelectorInTree(selectors: any, tree: any, selectFirst = false, searchFn: any) {
    return selectors.reduce((res: any, selector: any) => {
        return res.concat(findInTree(
            res,
            searchFn && typeof searchFn === 'function' ? searchFn : (child: any) => {
                if (typeof child.name === 'string') {
                    return matchSelector(selector, child.name)
                } else if (child.name !== null && typeof child.name === 'object') {
                    return matchSelector(selector, child.name.displayName)
                }

                return false
            },
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 3.
            selectFirst
        ))
    }, [tree])
}

/**
 * @name filterNodesBy
 * @param {Array<Object>}
 * @param {String}
 * @param {*}
 * @return {Array<Objects>}
 * @description Filter nodes by deep matching the node[key] to the obj
 */
export function filterNodesBy(nodes: any, key: any, matcher: any, exact = false) {
    if (isFunction(matcher)) {
        // eslint-disable-next-line no-console
        console.warn('Functions are not supported as filter matchers')
        return []
    }

    return nodes.filter((node: any) => (isNativeObject(matcher) && verifyIfObjectsMatch(matcher, node[key], exact)) ||
    (isArray(matcher) && verifyIfArraysMatch(matcher, node[key], exact)) ||
    (node[key] === matcher)
    )
}

/**
 * @name findReactInstance
 * @param {Object} element
 * @return {FiberNode}
 */
export function findReactInstance(element: any) {
    if (element.hasOwnProperty('_reactRootContainer')) {
        return element._reactRootContainer._internalRoot.current
    }

    const instanceId = Object.keys(element).find((key: any) => key.startsWith('__reactInternalInstance'))

    if (instanceId) {
        return element[instanceId]
    }
}
