import { HttpErrorResponse, HttpEvent } from '@angular/common/http'
import { HttpStatus } from '@qb/common/constants/http-status'

// @dynamic
export class SimpleError {
    public message: string
    public status: HttpStatus

    constructor(errorResponse?: HttpErrorResponse & HttpEvent<any>) {
        if (errorResponse) {
            this.message = errorResponse.error ? errorResponse.error.message : null
            this.status = errorResponse.status
        }
    }
}

// @dynamic
export abstract class IHttpSettings {
    public static httpFlashErrorBlacklist: { endpoint: string, method: string }[]
}

export enum HttpVerb {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE',
    Head = 'HEAD',
    Connect = 'CONNECT',
    Options = 'OPTIONS',
    Trace = 'TRACE',
    Patch = 'PATCH',
}
