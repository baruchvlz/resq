import deepEqual from 'fast-deep-equal'
import { findInTree, buildNodeTree } from './utils'

let tree,
    nodes,
    selectors,
    rootComponent

function searchTree(selectors, searchFn) {
    let treeArray = [tree]

    selectors.forEach((selector) => {
        treeArray = findInTree(treeArray, child => {
            if (searchFn && typeof searchFn === 'function') {
                return searchFn(child)
            }

            return child.name === selector
        })
    })

    return treeArray
}

class RESQNodes extends Array {
    constructor(nodes) {
        super(...nodes)
    }

    filterBy(key, obj) {
        const filtered = []

        const interator = el => {
            if (deepEqual(obj, el[key])) {
                filtered.push(el)
            }
        }

        this.forEach(interator)

        return filtered
    }

    byProps(props) {
        return this.filterBy('props', props)
    }

    byState(state) {
        return this.filterBy('state', state)
    }
}

class RESQNode extends Object {
    constructor(item) {
        super(item)

        for(let key in item) {
            this[key] = item[key]
        }
    }


    filterBy(key, obj) {
        const filtered = []

        const interator = el => {
            if (deepEqual(obj, el[key])) {
                filtered.push(el)
            }
        }

        if (nodes) {
            nodes.forEach(interator)

            return filtered[0]
        }
    }

    byProps(props) {
        return this.filterBy('props', props)
    }

    byState(state) {
        return this.filterBy('state', state)
    }
}

export default class RESQ {
    constructor(selector) {
        selectors = selector.split(' ').filter(el => !!el).map(el => el.trim())
        rootComponent = (document.querySelector('#root')).
            _reactRootContainer._internalRoot.current
        tree = buildNodeTree(rootComponent)
    }

    find() {
        nodes = new RESQNodes(searchTree(selectors))

        return new RESQNode(nodes[0])
    }

    findAll() {
        nodes = undefined

        return new RESQNodes(searchTree(selectors))
    }
}
