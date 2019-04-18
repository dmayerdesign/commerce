import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ShopState } from './shop.state'

@Injectable({ providedIn: 'root' })
export class ShopStore {
  private _state$ = new BehaviorSubject(new ShopState())
  public select<PropType extends ShopState[keyof ShopState]>(key: keyof ShopState): Observable<PropType> {
    return this._state$.pipe<PropType>(map((state) => state[key] as PropType))
  }
  public setState(partialState: Partial<ShopState>): void {
    this._state$.next({
      ...this._state$.value,
      ...partialState
    })
  }
}
