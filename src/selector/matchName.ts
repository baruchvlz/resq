const WILDCARD = '*'
const REGEX_SPECIAL_CHARACTERS = /([.*+?^=!:${}()|[\]/\\])/g
const strippedNamesByName = new Map<string, string>()

function computeStrippedName(componentName: string): string {
    const nameParts = componentName.split('(')

    if (nameParts.length === 1) {
        return componentName
    }

    const innermostPart = nameParts.find(part => part.includes(')'))

    // an unbalanced name such as `Foo(` is not a HoC wrapper
    return innermostPart === undefined ? componentName : innermostPart.replace(/\)*/g, '')
}

/** `connect(withRouter(Foo))` -> `Foo`. Names without a HoC wrapper are returned unchanged. */
export function stripHoCFromName(componentName: string): string {
    const cachedName = strippedNamesByName.get(componentName)

    if (cachedName !== undefined) {
        return cachedName
    }

    const strippedName = computeStrippedName(componentName)

    strippedNamesByName.set(componentName, strippedName)

    return strippedName
}

function escapeRegexCharacters(text: string): string {
    return text.replace(REGEX_SPECIAL_CHARACTERS, '\\$1')
}

export type NameMatcher = (componentName: string) => boolean

/** Compiles a selector segment (with optional `*` wildcards) into a matcher, once. */
export function compileNameMatcher(selector: string): NameMatcher {
    const pattern = selector.split(WILDCARD).map(escapeRegexCharacters).join('.+')
    const nameRegex = new RegExp(`^${pattern}$`)

    return componentName => nameRegex.test(stripHoCFromName(componentName))
}
