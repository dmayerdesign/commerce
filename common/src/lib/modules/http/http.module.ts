import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { HttpRequestInterceptor } from './http-request.interceptor'
import { HttpResponseInterceptor } from './http-response.interceptor'
import { HttpService } from './http.service'

@NgModule({
    imports: [
        HttpClientModule,
    ],
    exports: [
        HttpClientModule,
    ],
})
export class HttpModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: HttpModule,
            providers: [
                HttpService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpRequestInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpResponseInterceptor,
                    multi: true,
                },
            ],
        }
    }

    public static forChild(): ModuleWithProviders {
        return {
            ngModule: HttpModule
        }
    }
}
