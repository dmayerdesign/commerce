import { DomainEventVerb } from '@qb/common/constants/enums/domain-event-verb'
import { HttpVerb } from '@qb/common/modules/http/http.models'
import { Document } from 'mongoose'
import { Diff } from './diff'

export interface DomainEvent extends Document {
    verb: DomainEventVerb
    httpVerb?: HttpVerb
    httpRequest?: any
    httpResponse?: any
    diff: Diff
}
