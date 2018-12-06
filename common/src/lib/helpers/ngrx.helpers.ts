import { Type } from '@angular/core'
import { NgrxAction, NgrxMessage } from '@qb/common/models/ui/ngrx-action'
import { filter } from 'rxjs/operators'

export function filterByType<ActionType extends NgrxAction | NgrxMessage>(actionType: Type<ActionType>) {
  return filter<ActionType>((shopAction) => shopAction instanceof actionType)
}

