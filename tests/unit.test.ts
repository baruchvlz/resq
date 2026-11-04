import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResqError, resq$, resq$$, waitToLoadReact } from '../src'
import { isDomNode, isElement } from '../src/fiber/domNode'
import { findFiberRoot, isReactRootContainer } from '../src/fiber/findFiberRoot'
import {
    findFirstDescendantDomNode,
    isFragment,
    listChildFibers,
    readDomNode,
    readProps,
    readState,
} from '../src/fiber/readFiber'
import { resolveTypeName } from '../src/fiber/typeName'
import { filterNodesBy } from '../src/filter/filterNodes'
import { arraysMatch, objectsMatch } from '../src/filter/matchValues'
import { ReactSelectorQuery } from '../src/query/ReactSelectorQuery'
import { getLoadedRootFiber, setLoadedRootFiber } from '../src/root/rootStore'
import { compileNameMatcher, stripHoCFromName } from '../src/selector/matchName'
import { parseSelector } from '../src/selector/parseSelector'
import type { Fiber } from '../src/types'
import { locateRootFiber } from '../src/wait/locateRootFiber'
import { buildFiber, buildHostFiber, buildHostRootFiber, namedComponent } from './helpers/fiberBuilder'

function attachFiber(element: Element, key: string, fiber: Fiber): void {
    Object.defineProperty(element, key, { value: fiber, enumerable: true, configurable: true })
}

describe('domNode', () => {
    it('recognizes elements and text nodes by node type', () => {
        expect(isElement(document.createElement('div'))).toBe(true)
        expect(isElement(document.createTextNode('text'))).toBe(false)
        expect(isElement(null)).toBe(false)
        expect(isElement('div')).toBe(false)
        expect(isDomNode(document.createTextNode('text'))).toBe(true)
        expect(isDomNode(document.createElement('div'))).toBe(true)
        expect(isDomNode({ nodeType: 9 })).toBe(false)
    })
})

describe('resolveTypeName', () => {
    it('resolves host, function, displayName, memo and forwardRef names', () => {
        const Named = namedComponent('Named')
        const WithDisplayName = Object.assign(namedComponent('Ignored'), { displayName: 'Shown' })

        expect(resolveTypeName('div')).toBe('div')
        expect(resolveTypeName(Named)).toBe('Named')
        expect(resolveTypeName(WithDisplayName)).toBe('Shown')
        expect(resolveTypeName({ $$typeof: 'memo', type: Named })).toBe('Named')
        expect(resolveTypeName({ $$typeof: 'forwardRef', render: Named })).toBe('Named')
        expect(resolveTypeName({ displayName: 'styled.div' })).toBe('styled.div')
        expect(resolveTypeName({ $$typeof: 'memo', type: { $$typeof: 'forwardRef', render: Named } })).toBe('Named')
    })

    it('returns undefined for types without a name', () => {
        expect(resolveTypeName(null)).toBeUndefined()
        expect(resolveTypeName(undefined)).toBeUndefined()
        expect(resolveTypeName(42)).toBeUndefined()
        expect(resolveTypeName(namedComponent(''))).toBeUndefined()
        expect(resolveTypeName({ $$typeof: 'context' })).toBeUndefined()
        expect(resolveTypeName({ displayName: '' })).toBeUndefined()
    })

    it('caches the result per type', () => {
        const type = { displayName: 'Cached' }

        expect(resolveTypeName(type)).toBe('Cached')
        type.displayName = 'Changed'
        expect(resolveTypeName(type)).toBe('Cached')
    })
})

describe('readFiber', () => {
    it('lists children linked through siblings', () => {
        const parent = buildFiber('div', { children: [buildFiber('a'), buildFiber('b')] })

        expect(listChildFibers(parent).map(child => child.type)).toEqual(['a', 'b'])
        expect(listChildFibers(buildFiber('span'))).toEqual([])
    })

    it('reads props without children', () => {
        expect(readProps(buildFiber('div', { props: { id: 'x', children: ['y'] } }))).toEqual({ id: 'x' })
        expect(readProps({ memoizedProps: 'text' })).toBe('text')
        expect(readProps({ memoizedProps: null })).toBeNull()
    })

    it('reads class state and hook state', () => {
        expect(readState(buildFiber('div', { state: { open: true } }))).toEqual({ open: true })
        expect(readState(buildFiber('div', { state: { baseState: { on: true } } }))).toEqual({ on: true })
        expect(readState(buildFiber('div', { state: [1, 2, 3] }))).toEqual([1, 2, 3])
        expect(readState(buildFiber('div', { state: 'text' }))).toBe('text')
        expect(readState(buildFiber('div'))).toBeUndefined()
    })

    it('reads the DOM node of host fibers and of components with a host child', () => {
        const host = buildHostFiber('div')
        const component = buildFiber(namedComponent('Wrapper'), { children: [host] })
        const textFiber = buildFiber(null, { stateNode: document.createTextNode('hi') })

        expect(readDomNode(host)).toBe(host.stateNode)
        expect(readDomNode(component)).toBe(host.stateNode)
        expect(readDomNode(textFiber)).toBe(textFiber.stateNode)
        expect(readDomNode(buildFiber(namedComponent('Empty')))).toBeNull()
    })

    it('reads every child node of fragments, including nested ones', () => {
        const first = buildHostFiber('p')
        const second = buildHostFiber('p')
        const third = buildHostFiber('p')
        const nested = buildFiber(namedComponent('Nested'), { children: [second, third] })
        const fragment = buildFiber(namedComponent('Fragment'), {
            children: [first, nested, buildFiber(namedComponent('Empty'))],
        })

        expect(isFragment(fragment)).toBe(true)
        expect(isFragment(first)).toBe(false)
        expect(readDomNode(fragment)).toEqual([first.stateNode, second.stateNode, third.stateNode])
    })

    it('finds the first descendant DOM node breadth first', () => {
        const deepHost = buildHostFiber('i')
        const inner = buildFiber(namedComponent('Inner'), { children: [deepHost] })
        const outer = buildFiber(namedComponent('Outer'), {
            children: [buildFiber(namedComponent('Empty')), inner],
        })

        const veryDeepHost = buildHostFiber('b')
        const chain = buildFiber(namedComponent('First'), {
            children: [buildFiber(namedComponent('Second'), {
                children: [buildFiber(namedComponent('Third'), { children: [veryDeepHost] })],
            })],
        })

        expect(findFirstDescendantDomNode(outer)).toBe(deepHost.stateNode)
        expect(findFirstDescendantDomNode(chain)).toBe(veryDeepHost.stateNode)
        expect(findFirstDescendantDomNode(buildFiber(namedComponent('Lonely')))).toBeNull()
    })
})

describe('findFiberRoot', () => {
    it('reads the fiber from the legacy root container', () => {
        const container = document.createElement('div')
        const rootFiber = buildFiber(null)

        Object.defineProperty(container, '_reactRootContainer', { value: { _internalRoot: { current: rootFiber } } })

        expect(findFiberRoot(container)).toBe(rootFiber)
        expect(isReactRootContainer(container)).toBe(true)
    })

    it('reads fibers stored under the React 16, 17 and 18+ keys', () => {
        const fiber = buildHostRootFiber()

        for (const key of ['__reactInternalInstance$abc', '__reactFiber$abc', '__reactContainer$abc']) {
            const element = document.createElement('div')

            attachFiber(element, key, fiber)

            expect(findFiberRoot(element)).toBe(fiber)
        }
    })

    it('prefers the container key over the element key', () => {
        const element = document.createElement('div')
        const containerFiber = buildHostRootFiber()

        attachFiber(element, '__reactFiber$abc', buildHostRootFiber())
        attachFiber(element, '__reactContainer$abc', containerFiber)

        expect(findFiberRoot(element)).toBe(containerFiber)
    })

    it('returns undefined for elements React did not render', () => {
        const element = document.createElement('div')

        expect(findFiberRoot(element)).toBeUndefined()
        expect(isReactRootContainer(element)).toBe(false)
    })

    it('resolves the current half of an alternate pair', () => {
        const staleChild = buildFiber('div')
        const currentChild = buildFiber('div')
        const hostRoot = buildFiber(null, { children: [currentChild] })
        const fiberRoot = { current: hostRoot, containerInfo: {} }

        hostRoot.stateNode = fiberRoot
        staleChild.alternate = currentChild
        currentChild.alternate = staleChild
        staleChild.return = hostRoot
        currentChild.return = hostRoot

        const element = document.createElement('div')

        attachFiber(element, '__reactFiber$abc', staleChild)

        expect(findFiberRoot(element)).toBe(currentChild)
    })

    it('returns undefined when neither half of the pair is in the current tree', () => {
        const detachedFiber = buildFiber('div')
        const hostRoot = buildFiber(null, { children: [buildFiber('main')] })

        hostRoot.stateNode = { current: hostRoot, containerInfo: {} }
        detachedFiber.return = hostRoot
        detachedFiber.alternate = buildFiber('div')

        const element = document.createElement('div')

        attachFiber(element, '__reactFiber$abc', detachedFiber)

        expect(findFiberRoot(element)).toBeUndefined()
    })

    it('keeps fibers that were never updated', () => {
        const neverUpdated = buildFiber('div')
        const hostRoot = buildFiber(null, { children: [neverUpdated] })

        hostRoot.stateNode = { current: hostRoot, containerInfo: {} }
        neverUpdated.return = hostRoot

        const neverUpdatedElement = document.createElement('div')

        attachFiber(neverUpdatedElement, '__reactFiber$abc', neverUpdated)

        expect(findFiberRoot(neverUpdatedElement)).toBe(neverUpdated)
    })

    it('returns undefined for fibers React detached from the tree', () => {
        const detachedElement = document.createElement('div')

        attachFiber(detachedElement, '__reactFiber$abc', buildFiber('div'))

        expect(findFiberRoot(detachedElement)).toBeUndefined()
    })
})

describe('selectors', () => {
    it('strips HoC wrappers', () => {
        expect(stripHoCFromName('Foo')).toBe('Foo')
        expect(stripHoCFromName('connect(Foo)')).toBe('Foo')
        expect(stripHoCFromName('connect(withRouter(Foo))')).toBe('Foo')
        expect(stripHoCFromName('Unbalanced(')).toBe('Unbalanced(')
        expect(stripHoCFromName('connect(Foo)')).toBe('Foo')
    })

    it.each([
        ['simpleNodeName', 'simpleNodeName', true],
        ['simpleNode', 'simpleNodeName', false],
        ['simpleWildcardNode*', 'simpleWildcardNode', false],
        ['simpleWildcardNode*', 'simpleWildcardNodeName', true],
        ['*Node', 'MyNode', true],
        ['My*Node', 'MyAnotherNode', true],
        ['styled.div', 'styledXdiv', false],
        ['styled.div', 'styled.div', true],
        ['Foo', 'connect(Foo)', true],
    ])('matches selector %s against %s: %s', (selector, componentName, expected) => {
        expect(compileNameMatcher(selector)(componentName)).toBe(expected)
    })

    it('parses descendant chains and rejects invalid selectors', () => {
        expect(parseSelector('  Parent   Child ')).toHaveLength(2)
        expect(() => parseSelector('   ')).toThrowError(ResqError)
        expect(() => parseSelector(undefined as unknown as string)).toThrowError('must be a string')
    })
})

describe('value matching', () => {
    it('matches arrays by overlap or exactly', () => {
        expect(arraysMatch([1, 2], [2, 3])).toBe(true)
        expect(arraysMatch([1], [2, 3])).toBe(false)
        expect(arraysMatch([1, 2], [2, 1], true)).toBe(true)
        expect(arraysMatch([1, 2], [1, 2, 3], true)).toBe(false)
        expect(arraysMatch([1, 4], [1, 2], true)).toBe(false)
        expect(arraysMatch(1, [1])).toBe(false)
        expect(arraysMatch([1], 'text')).toBe(false)
    })

    it('matches objects partially', () => {
        expect(objectsMatch({ bar: true }, { bar: false })).toBe(false)
        expect(objectsMatch({ bar: 1 }, {})).toBe(false)
        expect(objectsMatch({}, { bar: 1 })).toBe(true)
        expect(objectsMatch({}, null)).toBe(true)
        expect(objectsMatch({ bar: 1 }, null)).toBe(false)
        expect(objectsMatch({ bar: 1 }, [1])).toBe(false)
        expect(objectsMatch({ bar: 123, foo: 321 }, { bar: 123 })).toBe(true)
        expect(objectsMatch({ foo: 1 }, { bar: 2 })).toBe(false)
        expect(objectsMatch({ count: 123, label: 'abc' }, { count: 123, label: 'abc', extra: true })).toBe(true)
        expect(objectsMatch({ count: 123, label: 'def' }, { count: 123, label: 'abc', extra: true })).toBe(false)
        expect(objectsMatch({ list: ['a'] }, { list: ['a', 'b'] })).toBe(true)
    })

    it('matches nested objects, including the same reference', () => {
        const shared = { works: true }

        expect(objectsMatch({ foo: { bar: { works: true } } }, { foo: { bar: { works: false } } })).toBe(false)
        expect(objectsMatch({ foo: { bar: { works: true } } }, { foo: { bar: { works: true } } })).toBe(true)
        expect(objectsMatch({ nested: shared }, { nested: shared })).toBe(true)
        expect(objectsMatch({ nested: null }, { nested: null })).toBe(true)
    })

    it('matches deeply when exact', () => {
        expect(objectsMatch({ bar: 123 }, { bar: 123 }, true)).toBe(true)
        expect(objectsMatch({ bar: 123 }, { bar: 123, foo: 1 }, true)).toBe(false)
    })

    it('filters nodes by props or state', () => {
        const nodes = [
            { props: { id: 'a' }, state: 'open' },
            { props: { id: 'b' }, state: [1, 2] },
            { props: 'text', state: undefined },
        ]

        expect(filterNodesBy(nodes, 'props', { id: 'a' })).toEqual([nodes[0]])
        expect(filterNodesBy(nodes, 'state', 'open')).toEqual([nodes[0]])
        expect(filterNodesBy(nodes, 'state', [2])).toEqual([nodes[1]])
        expect(filterNodesBy(nodes, 'state', [2], { exact: true })).toEqual([])
        expect(filterNodesBy(nodes, 'props', 'text')).toEqual([nodes[2]])
        expect(() => filterNodesBy(nodes, 'props', () => true)).toThrowError('Functions are not supported')
    })
})

describe('ReactSelectorQuery on fiber fixtures', () => {
    function buildTree(): Fiber {
        const wrapperName = namedComponent('TestWrapper')
        const firstSpan = buildHostFiber('span', { props: { testProp: 'some prop' } })
        const secondSpan = buildHostFiber('span', {
            props: { testProp: 'some prop', children: [{}] },
            state: { testState: true },
        })
        const textFiber = buildFiber(null, { props: 'Foo bar' })
        const section = buildHostFiber('div', { children: [firstSpan, secondSpan, textFiber] })
        const nestedWrapper = buildFiber(wrapperName, { children: [buildHostFiber('div')] })
        const wrapper = buildFiber(wrapperName, { props: { myProps: 'test prop' }, children: [section, nestedWrapper] })

        return buildFiber(undefined, { children: [wrapper] })
    }

    it('finds the first match and all matches in breadth-first order', () => {
        const query = new ReactSelectorQuery('TestWrapper span', buildTree())

        expect(query.find()?.props).toEqual({ testProp: 'some prop' })
        expect(query.findAll()).toHaveLength(2)
    })

    it('does not return duplicates when scopes are nested', () => {
        const query = new ReactSelectorQuery('TestWrapper div', buildTree())

        expect(query.findAll()).toHaveLength(2)
    })

    it('returns nothing when a segment of the chain has no match', () => {
        const query = new ReactSelectorQuery('Missing span', buildTree())

        expect(query.find()).toBeUndefined()
        expect(query.findAll()).toHaveLength(0)
    })

    it('exposes text children with their string content', () => {
        const section = new ReactSelectorQuery('div', buildTree()).find()
        const textChild = section?.children[2]

        expect(textChild?.props).toBe('Foo bar')
        expect(textChild?.name).toBeUndefined()
    })

    it('filters a single result among every match, searching them lazily once', () => {
        const query = new ReactSelectorQuery('span', buildTree())
        const firstSpan = query.find()
        const stateful = firstSpan?.byState({ testState: true })

        expect(stateful?.state).toEqual({ testState: true })
        expect(firstSpan?.byState({ testState: true })?.byProps({ testProp: 'some prop' })).toBeDefined()
        expect(firstSpan?.byState({ testState: false })).toBeUndefined()
    })

    it('filters among the matches of findAll from any of its nodes', () => {
        const [firstSpan] = new ReactSelectorQuery('span', buildTree()).findAll()

        expect(firstSpan?.byState({ testState: true })?.props).toEqual({ testProp: 'some prop' })
    })

    it('filters a node\'s children among their siblings', () => {
        const section = new ReactSelectorQuery('div', buildTree()).find()
        const [firstChild] = section?.children ?? []

        expect(firstChild?.byState({ testState: true })?.name).toBe('span')
        expect(firstChild?.byProps('Foo bar')?.name).toBeUndefined()
    })
})

describe('resq$ and resq$$ errors', () => {
    afterEach(() => {
        setLoadedRootFiber(undefined)
    })

    it('throws when no element is given and React was not waited for', () => {
        expect(() => resq$('div')).toThrowError('Could not find the root element of your application')
        expect(() => resq$$('div')).toThrowError(ResqError)
    })

    it('throws for values that are not DOM elements', () => {
        expect(() => resq$('div', {} as Element)).toThrowError('The given element is not a DOM element')
    })

    it('throws for elements React did not render', () => {
        expect(() => resq$('div', document.createElement('div'))).toThrowError(
            'Could not find instance of React in given element',
        )
    })

    it('queries the root remembered by waitToLoadReact', () => {
        const rootFiber = buildFiber(undefined, { children: [buildHostFiber('main')] })

        setLoadedRootFiber(rootFiber)

        expect(getLoadedRootFiber()).toBe(rootFiber)
        expect(resq$('main')?.name).toBe('main')
        expect(resq$$('main')).toHaveLength(1)
    })

    it('carries an error code', () => {
        try {
            resq$('div')
        } catch (error) {
            expect((error as ResqError).code).toBe('ROOT_NOT_LOADED')
            expect((error as ResqError).name).toBe('ResqError')
        }
    })
})

describe('waitToLoadReact', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        document.body.innerHTML = ''
    })

    afterEach(() => {
        vi.useRealTimers()
        setLoadedRootFiber(undefined)
    })

    it('resolves immediately when React was already found', async () => {
        setLoadedRootFiber(buildFiber(undefined))

        await expect(waitToLoadReact()).resolves.toBeUndefined()
    })

    it('finds a root container in the document by scanning it', async () => {
        const container = document.createElement('div')
        const rootFiber = buildHostRootFiber()

        document.body.appendChild(container)
        attachFiber(container, '__reactContainer$abc', rootFiber)

        await waitToLoadReact()


        expect(getLoadedRootFiber()).toBe(rootFiber)
    })

    it('uses the given root selector and polls until React renders', async () => {
        const container = document.createElement('div')
        const rootFiber = buildHostRootFiber()

        container.id = 'app'
        document.body.appendChild(container)

        const waiting = waitToLoadReact(2000, '#app')

        await vi.advanceTimersByTimeAsync(600)
        attachFiber(container, '__reactContainer$abc', rootFiber)
        await vi.advanceTimersByTimeAsync(300)
        await waiting

        expect(getLoadedRootFiber()).toBe(rootFiber)
    })

    it('rejects with a typed error when React never renders', async () => {
        const waiting = waitToLoadReact(1000)
        const assertion = expect(waiting).rejects.toMatchObject({ code: 'WAIT_TIMEOUT', name: 'ResqError' })

        await vi.advanceTimersByTimeAsync(1000)
        await assertion

        expect(vi.getTimerCount()).toBe(0)
    })

    it('locates nothing when the selector matches no element', () => {
        expect(locateRootFiber('#missing')).toBeUndefined()
        expect(locateRootFiber()).toBeUndefined()
    })
})
