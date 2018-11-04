import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { of, throwError, Observable } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'

import { HttpStatus } from '../../../constants'
import { HttpInjectionTokens } from './http.injection-tokens'
import { IHttpSettings, SimpleError } from './http.models'
import { MteHttpService } from './http.service'

@Injectable()
export class MteHttpResponseInterceptor implements HttpInterceptor {

    constructor(
        private mteHttpService: MteHttpService,
        @Inject(HttpInjectionTokens.HttpSettings) private httpSettings: typeof IHttpSettings,
    ) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const isBlacklistedFromErrorFlash = (): boolean => {
            return this.httpSettings &&
                this.httpSettings.httpFlashErrorBlacklist &&
                this.httpSettings.httpFlashErrorBlacklist.some((x) => {
                    return request.method.toLowerCase() === x.method.toLowerCase() &&
                        !!request.url.match(new RegExp(x.endpoint))
                })
        }

        return of(request)
            .pipe(
                switchMap<HttpRequest<any>, HttpErrorResponse>((req) => next.handle(req)),
                catchError((errorResponse) => {
                    // console.log('[MteHttpResponseInterceptor#intercept] Error response', errorResponse)
                    const error = new SimpleError(errorResponse)

                    // If the error is a 401, pipe it through the `sessionInvalids` stream.

                    if (error.status === HttpStatus.CLIENT_ERROR_UNAUTHORIZED) {
                        this.mteHttpService.sessionInvalids.next(error)
                    }

                    // Else, if the error is coming from a blacklisted endpoint, pipe it through the generic `errors` stream.

                    else if (!isBlacklistedFromErrorFlash()) {
                        this.mteHttpService.errors.next(error)
                    }

                    return throwError(error)
                })
            ) as any
    }
}
