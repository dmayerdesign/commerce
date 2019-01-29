import { DomainEventVerb } from '@qb/common/constants/enums/domain-event-verb'
import { HttpVerb } from '@qb/common/modules/http/http.models'
import { Entity } from '../data-access/entity.interface'
import { Diff } from '../diff/diff.interface'

export interface DomainEvent extends Entity {
    verb: DomainEventVerb
    httpVerb?: HttpVerb
    httpRequest?: any
    httpResponse?: any
    diff: Diff
}
