import RESQ from '../src/resq'

import { vdom } from './__mocks__/vdom'

beforeEach(() => {
    RESQ.getRootComponent = () => vdom
})

describe('RESQ', () => {
    it('should build', () => {
        const resq = new RESQ('TestWrapper')

        expect(resq).toBeTruthy()
    })

    it('should select one element', () => {
        const resq = new RESQ('TestWrapper span')
        resq.rootComponent = vdom

        const $ = resq.find()

        expect($).toMatchObject(
            {
                name: 'span',
                props: { testProp: 'some prop' },
                state: {},
                node: document.createElement('span'),
            },
        )
    })

    it('should select multiple elements', () => {
        const resq = new RESQ('TestWrapper div')
        resq.rootComponent = vdom

        const $$ = resq.findAll()

        expect($$).toMatchObject([
            {
                name: 'div',
                props: { testProp: 'some prop' },
                state: {},
                node: document.createElement('div'),
            },
            {
                name: 'div',
                props: { testProp: 'some prop' },
                state: { testState: true },
                node: document.createElement('div'),
            },
            {
                name: 'div',
                props: { },
                state: {
                    testState: true,
                },
                node: document.createElement('div'),
            },
        ])
    })

    describe('byProps', () => {
        it('should return the first instance of component filtered by prop', () => {
            const resq = new RESQ('TestWrapper div')
            resq.rootComponent = vdom

            const $ = resq.find()
            const result = $.byProps({ testProp: 'some prop' })

            expect(result).toMatchObject({
                name: 'div',
                props: { testProp: 'some prop' },
                state: {},
                node: document.createElement('div'),
            })
        })

        it('should return all components filtered by prop', () => {
            const resq = new RESQ('TestWrapper div')
            resq.rootComponent = vdom

            const $$ = resq.findAll()

            const result = $$.byProps({ testProp: 'some prop' })

            expect(result.length).toBe(2)
            expect(result).toMatchObject([
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('div'),
                },
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: { testState: true },
                    node: document.createElement('div'),
                },
            ])
        })
    })

    describe('byState', () => {
        it('should return the first instance of component filtered by state', () => {
            const resq = new RESQ('TestWrapper div')
            resq.rootComponent = vdom

            const $ = resq.find()
            const result = $.byState({ testState: true })

            expect(result).toMatchObject({
                name: 'div',
                props: { testProp: 'some prop' },
                state: { testState: true },
                node: document.createElement('div'),
            })
        })

        it('should return all components filtered by state', () => {
            const resq = new RESQ('TestWrapper div')
            resq.rootComponent = vdom

            const $$ = resq.findAll()

            const result = $$.byState({ testState: true })

            expect(result.length).toBe(2)
            expect(result).toMatchObject([
                {
                    name: 'div',
                    props: { testProp: 'some prop' },
                    state: { testState: true },
                    node: document.createElement('div'),
                },
                {
                    name: 'div',
                    props: { },
                    state: {
                        testState: true,
                    },
                    node: document.createElement('div'),
                },
            ])
        })
    })
})
