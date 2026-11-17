import {
    Component,
    createElement,
    forwardRef,
    Fragment,
    memo,
    useState,
    type ReactElement,
} from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { resq$, resq$$ } from '../src'
import { setLoadedRootFiber } from '../src/root/rootStore'
import { renderApp, unmountApp, type RenderedApp } from './helpers/renderApp'

function Button({ label, primary }: { label: string; primary?: boolean }) {
    return createElement('button', { 'data-primary': primary }, label)
}

class Counter extends Component<{ step: number }, { count: number }> {
    override state = { count: 1 }

    override render() {
        return createElement('span', null, `${this.state.count}`)
    }
}

function HookToggle() {
    const [isOn] = useState({ on: true })

    return createElement('i', null, String(isOn.on))
}

function TwoSiblings() {
    return createElement(Fragment, null, createElement('b', null, 'one'), createElement('b', null, 'two'))
}

function Inner() {
    return createElement('em', null, 'inner')
}

const Wrapped = memo(function Wrapped() {
    return createElement('u', null, 'memo')
})

const Forwarded = forwardRef<HTMLDivElement>(function Forwarded(_props, ref) {
    return createElement('div', { ref }, 'forwarded')
})

function withBorder(Target: () => ReactElement) {
    function WithBorder() {
        return createElement('section', null, createElement(Target))
    }

    WithBorder.displayName = 'withBorder(Inner)'

    return WithBorder
}

const Bordered = withBorder(Inner)

function Passthrough() {
    return createElement(Button, { label: 'nested' })
}

function App() {
    return createElement(
        'main',
        null,
        createElement(Button, { label: 'first' }),
        createElement(Button, { label: 'second', primary: true }),
        createElement(Counter, { step: 2 }),
        createElement(HookToggle),
        createElement(TwoSiblings),
        createElement(Wrapped),
        createElement(Forwarded),
        createElement(Bordered),
        createElement(Passthrough),
    )
}

describe('resq against real React renders', () => {
    let renderedApp: RenderedApp

    beforeEach(async () => {
        renderedApp = await renderApp(createElement(App))
    })

    afterEach(async () => {
        await unmountApp(renderedApp)
        setLoadedRootFiber(undefined)
    })

    it('selects the first component by name with its props and DOM node', () => {
        const button = resq$('Button', renderedApp.container)

        expect(button?.name).toBe('Button')
        expect(button?.props).toEqual({ label: 'first' })
        expect((button?.node as HTMLElement).textContent).toBe('first')
    })

    it('selects every matching component', () => {
        expect(resq$$('Button', renderedApp.container)).toHaveLength(3)
    })

    it('returns undefined when nothing matches', () => {
        expect(resq$('Missing', renderedApp.container)).toBeUndefined()
        expect(resq$$('Missing', renderedApp.container)).toHaveLength(0)
    })

    it('supports wildcards', () => {
        const names = resq$$('Co*', renderedApp.container).map(node => node.name)

        expect(names).toEqual(['Counter'])
    })

    it('supports descendant chains', () => {
        expect(resq$('Inner Inner', renderedApp.container)?.name).toBe('Inner')
        expect(resq$('main button', renderedApp.container)?.name).toBe('button')
        expect(resq$$('main Button button', renderedApp.container)).toHaveLength(3)
    })

    it('reads class component state', () => {
        expect(resq$('Counter', renderedApp.container)?.state).toEqual({ count: 1 })
    })

    it('reads hook state', () => {
        expect(resq$('HookToggle', renderedApp.container)?.state).toEqual({ on: true })
    })

    it('exposes fragments as an array of DOM nodes', () => {
        const siblings = resq$('TwoSiblings', renderedApp.container)

        expect(siblings?.isFragment).toBe(true)
        expect(siblings?.node).toHaveLength(2)
    })

    it('resolves memo and forwardRef component names', () => {
        expect(resq$('Wrapped', renderedApp.container)?.name).toBe('Wrapped')
        expect(resq$('Forwarded', renderedApp.container)?.name).toBe('Forwarded')
    })

    it('strips HoC wrappers from names', () => {
        const matches = resq$$('Inner', renderedApp.container)

        expect(matches.map(node => node.name)).toEqual(['withBorder(Inner)', 'Inner'])
        expect(resq$('withBorder(Inner)', renderedApp.container)).toBeUndefined()
    })

    it('filters a single result among all matches', () => {
        const primaryButton = resq$('Button', renderedApp.container)?.byProps({ primary: true })

        expect(primaryButton?.props).toEqual({ label: 'second', primary: true })
        expect(resq$('Button', renderedApp.container)?.byProps({ primary: 'nope' })).toBeUndefined()
    })

    it('composes chained filters on a single result', () => {
        const button = resq$('Button', renderedApp.container)

        expect(button?.byProps({ primary: true })?.byProps({ label: 'first' })).toBeUndefined()
        expect(button?.byProps({ primary: true })?.byProps({ label: 'second' })?.props.label).toBe('second')
    })

    it('filters multiple results and keeps them chainable', () => {
        const buttons = resq$$('Button', renderedApp.container)

        expect(buttons.byProps({ primary: true })).toHaveLength(1)
        expect(buttons.byProps({ label: 'first' }, { exact: true }).byProps({ primary: true })).toHaveLength(0)
        expect(resq$$('Counter', renderedApp.container).byState({ count: 1 })).toHaveLength(1)
    })

    it('returns plain arrays from map and filter', () => {
        const labels = resq$$('Button', renderedApp.container).map(node => node.props.label)

        expect(labels).toEqual(['first', 'second', 'nested'])
        expect(resq$$('Button', renderedApp.container).filter(node => node.props.primary)).toHaveLength(1)
    })

    it('lists children lazily and memoizes them', () => {
        const main = resq$('main', renderedApp.container)

        expect(main?.children.length).toBeGreaterThan(5)
        expect(main?.children).toBe(main?.children)
    })

    it('resolves the node of a component without a direct host node', () => {
        const passthrough = resq$('Passthrough', renderedApp.container)

        expect((passthrough?.node as HTMLElement).textContent).toBe('nested')
    })
})
