import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AppConfig } from '@qb/app-config'
import { Observable } from 'rxjs'

@Injectable()
export class QbHttpRequestInterceptor implements HttpInterceptor {

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newRequest = request
        if (request.url.indexOf('/api') === 0) {
            newRequest = request.clone({ url: AppConfig.client_url + request.url })
            if (newRequest.urlWithParams.length > 1800) {
                console.warn([
                    'A request was sent with a URL longer than 1800 characters, approaching the',
                    'recommended limit of 2048 characters.'
                ].join(' '))
            }
        }
        return next.handle(newRequest)
    }
}
