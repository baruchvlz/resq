import { createElement, useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { resq$ } from '../src'
import { act, renderApp, unmountApp, type RenderedApp } from './helpers/renderApp'

function Counter() {
    const [count, setCount] = useState(0)

    return createElement('button', { onClick: () => setCount(count + 1) }, `count ${count}`)
}

describe('fibers attached to DOM elements after React re-renders', () => {
    let renderedApp: RenderedApp | undefined

    afterEach(async () => {
        if (renderedApp) {
            await unmountApp(renderedApp)
            renderedApp = undefined
        }
    })

    it('queries the current tree through the container after updates', async () => {
        renderedApp = await renderApp(createElement(Counter))
        const button = renderedApp.container.querySelector('button') as HTMLButtonElement

        await act(async () => {
            button.click()
        })
        await act(async () => {
            button.click()
        })

        expect(resq$('Counter', renderedApp.container)?.state).toEqual(2)
    })

    it('queries the current tree through a rendered element after updates', async () => {
        renderedApp = await renderApp(createElement('section', null, createElement(Counter)))
        const section = renderedApp.container.querySelector('section') as HTMLElement
        const button = renderedApp.container.querySelector('button') as HTMLButtonElement

        await act(async () => {
            button.click()
        })
        await act(async () => {
            button.click()
        })

        expect(resq$('Counter', section)?.state).toEqual(2)
    })

    it('treats an element that React unmounted as not rendered by React', async () => {
        renderedApp = await renderApp(createElement('section', null, createElement(Counter)))
        const section = renderedApp.container.querySelector('section') as HTMLElement
        const button = renderedApp.container.querySelector('button') as HTMLButtonElement

        await act(async () => {
            button.click()
        })
        await act(async () => {
            renderedApp?.root.render(createElement('p'))
        })

        expect(() => resq$('Counter', section)).toThrowError('Could not find instance of React in given element')
    })
})
