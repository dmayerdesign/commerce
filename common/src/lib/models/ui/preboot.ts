import { Observable } from 'rxjs'

export interface Preboot {
  ready$: Observable<boolean>
}
