import { DomainEventVerb } from '@qb/common/constants/enums/domain-event-verb'
import { HttpVerb } from '@qb/common/modules/http/http.models'
import { Diff } from './diff'
import { Entity } from './entity'

export interface DomainEvent extends Entity {
    verb: DomainEventVerb
    httpVerb?: HttpVerb
    httpRequest?: any
    httpResponse?: any
    diff: Diff
}
