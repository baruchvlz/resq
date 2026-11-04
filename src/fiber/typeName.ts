const resolvedNamesByType = new WeakMap<object, string | undefined>()

function readStringProperty(target: object, propertyName: string): string | undefined {
    const value = (target as Record<string, unknown>)[propertyName]

    return typeof value === 'string' && value !== '' ? value : undefined
}

function computeTypeName(type: object): string | undefined {
    const displayName = readStringProperty(type, 'displayName')

    if (displayName) {
        return displayName
    }

    if (typeof type === 'function') {
        return type.name || undefined
    }

    // forwardRef components wrap the render function, memo components wrap the inner component
    const wrappedType = (type as Record<string, unknown>).render ?? (type as Record<string, unknown>).type

    if (typeof wrappedType === 'function' || (typeof wrappedType === 'object' && wrappedType !== null)) {
        return computeTypeName(wrappedType)
    }

    return undefined
}

/**
 * Resolves the display name of a fiber `type`: a tag name for host elements, `displayName` or
 * the function name for components, and the wrapped component for `memo` / `forwardRef`.
 * Returns `undefined` for fibers that have no name (root, text, fragments).
 */
export function resolveTypeName(type: unknown): string | undefined {
    if (typeof type === 'string') {
        return type
    }

    if (typeof type !== 'function' && (typeof type !== 'object' || type === null)) {
        return undefined
    }

    if (resolvedNamesByType.has(type)) {
        return resolvedNamesByType.get(type)
    }

    const name = computeTypeName(type)

    resolvedNamesByType.set(type, name)

    return name
}
