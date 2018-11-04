import { HttpErrorResponse, HttpEvent } from '@angular/common/http'
import { HttpStatus } from '../../../constants/http-status'

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

export abstract class IHttpSettings {
    public static httpFlashErrorBlacklist: { endpoint: string, method: string }[]
}
