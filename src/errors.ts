export type ResqErrorCode =
    | 'ROOT_NOT_LOADED'
    | 'REACT_INSTANCE_NOT_FOUND'
    | 'INVALID_ELEMENT'
    | 'INVALID_SELECTOR'
    | 'WAIT_TIMEOUT'

export class ResqError extends Error {
    readonly code: ResqErrorCode

    constructor(code: ResqErrorCode, message: string) {
        super(message)
        this.name = 'ResqError'
        this.code = code
    }
}
