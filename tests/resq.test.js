import ReactSelectorQuery from '../src/resq'

import { vdom } from './__mocks__/vdom'

describe('ReactSelectorQuery', () => {
    it('should build', () => {
        const resq = new ReactSelectorQuery('TestWrapper', vdom)

        expect(resq).toBeTruthy()
    })

    it('should select one element', () => {
        const resq = new ReactSelectorQuery('TestWrapper span', vdom)
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
        const resq = new ReactSelectorQuery('TestWrapper div', vdom)
        const $$ = resq.findAll()

        expect($$).toMatchObject([
            {
                name: 'div',
                props: {},
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
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
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
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
            const $$ = resq.findAll()

            const result = $$.byProps({ testProp: 'some prop' })

            expect(result).toMatchObject([
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
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
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
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
            const $$ = resq.findAll()
            const result = $$.byState({ testState: true })

            expect(result.length).toBe(3)
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

    describe('should be able to use both filtering functions', () => {
        it('should filter for one instance', () => {
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
            const $ = resq.find()
            const result = $.byProps({}).byState({ testState: true })

            expect(result).toMatchObject({
                name: 'div',
                props: {},
                state: { testState: true },
                node: document.createElement('div'),
            })
        })

        it('should filter for multiple instances', () => {
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
            const $$ = resq.findAll()
            const result = $$.byState({ testState: true }).byProps({})

            expect(result).toMatchObject([
                {
                    name: 'div',
                    props: {},
                    state: { testState: true },
                    node: document.createElement('div'),
                },
                {
                    name: 'div',
                    props: {},
                    state: { testState: true },
                    node: document.createElement('div'),
                },
            ])
        })
    })
})
