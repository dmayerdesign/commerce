import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { SimpleError } from './http.models'

@Injectable()
export class HttpService {
    public errors = new ReplaySubject<SimpleError>()
    public sessionInvalids = new ReplaySubject<SimpleError>()
}
