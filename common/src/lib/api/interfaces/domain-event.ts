import { DomainEventVerb } from '@qb/common/constants/enums/domain-event-verb'
import { HttpVerb } from '@qb/common/modules/http/http.models'
import { Diff } from './diff'
import { MongooseDocument } from './mongoose-document'

export interface DomainEvent extends MongooseDocument {
    verb: DomainEventVerb
    httpVerb?: HttpVerb
    httpRequest?: any
    httpResponse?: any
    diff: Diff
}
