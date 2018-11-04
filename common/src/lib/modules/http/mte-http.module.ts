import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { MteHttpRequestInterceptor } from './http-request.interceptor'
import { MteHttpResponseInterceptor } from './http-response.interceptor'
import { MteHttpService } from './http.service'

@NgModule({
    imports: [
        HttpClientModule,
    ],
    exports: [
        HttpClientModule,
    ],
})
export class MteHttpModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: MteHttpModule,
            providers: [
                MteHttpService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MteHttpRequestInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MteHttpResponseInterceptor,
                    multi: true,
                },
            ],
        }
    }

    public static forChild(): ModuleWithProviders {
        return {
            ngModule: MteHttpModule
        }
    }
}
