import { defineConfig } from 'vitepress'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const apiDirectory = join(__dirname, '..', 'api')

function buildApiSidebarGroup(directoryName: string, groupLabel: string) {
    const groupDirectory = join(apiDirectory, directoryName)
    const pageNames = readdirSync(groupDirectory)
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => fileName.replace(/\.md$/, ''))

    return {
        text: groupLabel,
        collapsed: false,
        items: pageNames.map(pageName => ({
            text: pageName,
            link: `/api/${directoryName}/${pageName}`,
        })),
    }
}

export default defineConfig({
    title: 'resq',
    description: 'React Element Selector Query: query React components by name, like querySelector for the React tree.',
    base: '/resq/',
    cleanUrls: true,
    lastUpdated: true,
    themeConfig: {
        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'API', link: '/api/' },
            { text: 'Migrating to v2', link: '/guide/migration-v1-to-v2' },
        ],
        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
                    items: [
                        { text: 'Getting started', link: '/guide/getting-started' },
                        { text: 'Selecting components', link: '/guide/selecting' },
                        { text: 'Filtering by props and state', link: '/guide/filtering' },
                        { text: 'Waiting for React', link: '/guide/async' },
                        { text: 'Using with automation tools', link: '/guide/automation-tools' },
                        { text: 'React version support', link: '/guide/react-support' },
                        { text: 'Performance', link: '/guide/performance' },
                        { text: 'Migrating from v1', link: '/guide/migration-v1-to-v2' },
                    ],
                },
            ],
            '/api/': [
                { text: 'API reference', link: '/api/' },
                buildApiSidebarGroup('functions', 'Functions'),
                buildApiSidebarGroup('interfaces', 'Interfaces'),
                buildApiSidebarGroup('classes', 'Classes'),
                buildApiSidebarGroup('type-aliases', 'Type aliases'),
            ],
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/baruchvlz/resq' }],
        search: { provider: 'local' },
        editLink: {
            pattern: 'https://github.com/baruchvlz/resq/edit/v2/docs/:path',
            text: 'Edit this page on GitHub',
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © Baruch Velez',
        },
    },
})
