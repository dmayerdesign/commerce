import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { of, throwError, Observable } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { HttpStatus } from '../../constants/http-status'
import { HttpInjectionTokens } from './http.injection-tokens'
import { IHttpSettings, SimpleError } from './http.models'
import { QbHttpService } from './http.service'

@Injectable()
export class QbHttpResponseInterceptor implements HttpInterceptor {

    constructor(
        private _httpService: QbHttpService,
        // @Inject(HttpInjectionTokens.HttpSettings) private _httpSettings: typeof IHttpSettings,
    ) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const isBlacklistedFromErrorFlash = (): boolean => {
            return false
            // return this._httpSettings &&
            //     this._httpSettings.httpFlashErrorBlacklist &&
            //     this._httpSettings.httpFlashErrorBlacklist.some((x) => {
            //         return request.method.toLowerCase() === x.method.toLowerCase() &&
            //             !!request.url.match(new RegExp(x.endpoint))
            //     })
        }

        return of(request)
            .pipe(
                switchMap<HttpRequest<any>, HttpEvent<any>>((req) => next.handle(req)),
                catchError((errorResponse) => {
                    const error = new SimpleError(errorResponse)

                    // If the error is a 401, pipe it through the `sessionInvalids` stream.

                    if (error.status === HttpStatus.CLIENT_ERROR_UNAUTHORIZED) {
                        this._httpService.sessionInvalids.next(error)
                    }

                    // Else, if the error is coming from a blacklisted endpoint, pipe it through the generic `errors` stream.

                    else if (!isBlacklistedFromErrorFlash()) {
                        this._httpService.errors.next(error)
                    }

                    return throwError(error)
                })
            ) as any
    }
}
