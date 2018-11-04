import { Type } from '@angular/core'
import { Observable } from 'rxjs'
import { Action } from './action'

export type ActionStream<ActionType extends Action = Action> = (
    ...actionTypes: Type<ActionType>[]
) => Observable<ActionType>
