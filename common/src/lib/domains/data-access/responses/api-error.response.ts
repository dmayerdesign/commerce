import { HttpStatus } from '@qb/common/constants/http-status'

export class ApiErrorResponse {
    constructor(
        public error: Error,
        public status: HttpStatus = HttpStatus.SERVER_ERROR_INTERNAL,
        public message?: string
    ) { }
}
