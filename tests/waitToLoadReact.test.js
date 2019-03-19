import { REACT_VERSION_MATCHERS, waitToLoadReact } from '../src/waitToLoadReact'

// reset the document object so it doesn't over lap other tests
afterEach(() => {
    global.document = {}
    global.document.createTreeWalker = () => ({
        currentNode: {},
        nextNode: () => false,
    })
    global.document.querySelector = () => {}
})
describe('waitToLoadReact', () => {

    it('should get react 16 apps', () => {
        global.document.createTreeWalker = () => ({
            currentNode: {
                [REACT_VERSION_MATCHERS.V16]: 'foobar',
            },
            nextNode: () => true,
        })

        waitToLoadReact(10).then(() => {
            expect(global.reactVersion).toBe(REACT_VERSION_MATCHERS.V16)
        })

    })

    it('should get react apps rendered with ssr', () => {
        global.document[REACT_VERSION_MATCHERS.SSR] = ['true']

        waitToLoadReact(10).then(() => {
            expect(global.reactVersion).toBe(REACT_VERSION_MATCHERS.SSR)
        })
    })

    it('should timeout if React app is not found', () => {
        waitToLoadReact(10).catch((err) =>  {
            expect(err).toMatch('Timed out')
        })
    })
})
