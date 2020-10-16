import ReactSelectorQuery from '../src/resq'

import { vdom } from './__mocks__/vdom'

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('ReactSelectorQuery', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build', () => {
        const resq = new ReactSelectorQuery('TestWrapper', vdom)

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(resq).toBeTruthy()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should select one element', () => {
        const resq = new ReactSelectorQuery('TestWrapper span', vdom)
        const $ = resq.find()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect($).toMatchObject(
            {
                name: 'span',
                props: { testProp: 'some prop' },
                state: {},
                node: document.createElement('span'),
            },
        )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should select multiple elements', () => {
        const resq = new ReactSelectorQuery('TestWrapper div', vdom)
        const $$ = resq.findAll()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect($$).toMatchObject([
            {
                name: 'div',
                props: {},
                state: {},
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('byProps', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the first instance of component filtered by prop', () => {
            const resq = new ReactSelectorQuery('TestWrapper span', vdom)
            const $ = resq.find()
            const result = $.byProps({ testProp: 'some prop' })

            delete result._nodes

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(result).toMatchObject({
                name: 'span',
                props: { testProp: 'some prop' },
                state: {},
                node: document.createElement('span'),
            })
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return all components filtered by prop', () => {
            const resq = new ReactSelectorQuery('TestWrapper span', vdom)
            const $$ = resq.findAll()

            const result = $$.byProps({ testProp: 'some prop' })

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(result).toMatchObject([
                {
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: {},
                    node: document.createElement('span'),
                    children: [],
                },
                {
                    name: 'span',
                    props: { testProp: 'some prop' },
                    state: { testState: true },
                    node: document.createElement('span'),
                },
            ])
        })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('byState', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the first instance of component filtered by state', () => {
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
            const $ = resq.find()
            const result = $.byState({ testState: true })

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(result).toMatchObject({
                name: 'div',
                props: { },
                state: { testState: true },
                node: document.createElement('div'),
            })
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return all components filtered by state', () => {
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
            const $$ = resq.findAll()
            const result = $$.byState({ testState: true })

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(result.length).toBe(1)
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(result).toMatchObject([
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('should be able to use both filtering functions', () => {
        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should filter for one instance', () => {
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
            const $ = resq.find()
            const result = $.byProps({}).byState({ testState: true })

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(result).toMatchObject({
                name: 'div',
                props: {},
                state: { testState: true },
                node: document.createElement('div'),
            })
        })

        // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should filter for multiple instances', () => {
            const resq = new ReactSelectorQuery('TestWrapper div', vdom)
            const $$ = resq.findAll()
            const result = $$.byState({ testState: true }).byProps({})

            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
            expect(result).toMatchObject([
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
