import { InjectionToken } from '@angular/core'

export class HttpInjectionTokens {
    public static readonly HttpSettings = new InjectionToken<string>('HttpSettings')
}
