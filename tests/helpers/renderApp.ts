/**
 * Renders with whichever React version is installed, so the same tests cover React 16 to 19:
 * - 18 and 19 use `createRoot`, 16 and 17 use the legacy `ReactDOM.render`,
 * - `act` comes from `react` on 18+ and from `react-dom/test-utils` before that.
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'

type Element = React.ReactElement
type ActCallback = () => void | Promise<void>

interface ReactRootHandle {
    render(appElement: Element): void
    unmount(): void
}

export interface RenderedApp {
    container: HTMLElement
    root: ReactRootHandle
}

const reactMajorVersion = Number(React.version.split('.')[0])

;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

async function loadAct(): Promise<(callback: ActCallback) => Promise<void>> {
    if (reactMajorVersion >= 18) {
        return (React as unknown as { act: (callback: ActCallback) => Promise<void> }).act
    }

    const testUtils = await import('react-dom/test-utils')

    return (testUtils as unknown as { act: (callback: ActCallback) => Promise<void> }).act
}

async function createRootHandle(container: HTMLElement): Promise<ReactRootHandle> {
    if (reactMajorVersion >= 18) {
        // the module does not exist before React 18, so keep the bundler from resolving it statically
        const clientSpecifier = 'react-dom/client'
        const clientModule = await import(/* @vite-ignore */ clientSpecifier) as {
            createRoot(container: HTMLElement): ReactRootHandle
        }

        return clientModule.createRoot(container)
    }

    const legacyDom = ReactDOM as unknown as {
        render(appElement: Element, container: HTMLElement): void
        unmountComponentAtNode(container: HTMLElement): void
    }

    return {
        render: appElement => legacyDom.render(appElement, container),
        unmount: () => legacyDom.unmountComponentAtNode(container),
    }
}

export async function act(callback: ActCallback): Promise<void> {
    const actImplementation = await loadAct()

    await actImplementation(callback)
}

export async function renderApp(appElement: Element): Promise<RenderedApp> {
    const container = document.createElement('div')

    document.body.appendChild(container)

    const root = await createRootHandle(container)

    await act(async () => {
        root.render(appElement)
    })

    return { container, root }
}

export async function unmountApp({ container, root }: RenderedApp): Promise<void> {
    await act(async () => {
        root.unmount()
    })
    container.remove()
}

export function getReactMajorVersion(): number {
    return reactMajorVersion
}
