import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { QbHttpRequestInterceptor } from './http-request.interceptor'
import { QbHttpResponseInterceptor } from './http-response.interceptor'
import { QbHttpService } from './http.service'

@NgModule({
    imports: [
        HttpClientModule,
    ],
    exports: [
        HttpClientModule,
    ],
})
export class QbHttpModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: QbHttpModule,
            providers: [
                QbHttpService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: QbHttpRequestInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: QbHttpResponseInterceptor,
                    multi: true,
                },
            ],
        }
    }

    public static forChild(): ModuleWithProviders {
        return {
            ngModule: QbHttpModule
        }
    }
}
