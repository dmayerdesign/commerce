import { Observable, ReplaySubject } from 'rxjs'
import { delay } from 'rxjs/operators'

export function timeout(timeout: number): Observable<any> {
    const subject = new ReplaySubject(1)
    const observable = subject.asObservable().pipe(delay(timeout))
    subject.next(0)
    return observable
}
