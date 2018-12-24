import { DomainEventVerb } from '@qb/common/constants/enums/domain-event-verb'
import { HttpVerb } from '@qb/common/modules/http/http.models'
import { model, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'
import { Diff } from './diff'

@model(MongooseSchemaOptions.timestamped)
export class DomainEvent extends MongooseDocument {
    @prop() public verb: DomainEventVerb
    @prop() public httpVerb?: HttpVerb
    @prop() public httpRequest?: any
    @prop() public httpResponse?: any
    @prop() public diff: Diff
}

export class CreateDomainEventError extends Error { }
export class FindDomainEventError extends Error { }
export class UpdateDomainEventError extends Error { }
export class DeleteDomainEventError extends Error { }
