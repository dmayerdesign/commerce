import { Type } from '@angular/core'
import { NgrxAction, NgrxMessage } from '@qb/common/models/ui/ngrx-action'
import { MonoTypeOperatorFunction } from 'rxjs'
import { filter } from 'rxjs/operators'

export function filterByType<ActionType extends NgrxAction | NgrxMessage>(
  actionType: Type<ActionType>
): MonoTypeOperatorFunction<ActionType> {
  return filter<ActionType>((shopAction) => shopAction instanceof actionType)
}
