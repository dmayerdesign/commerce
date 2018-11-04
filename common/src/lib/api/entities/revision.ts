import { model, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'

@model(Revision, MongooseSchemaOptions.timestamped)
export class Revision extends MongooseDocument {
    @prop() public id: string
    @prop() public field: string
    @prop() public value: any
}

export class CreateRevisionError extends Error { }
export class FindRevisionError extends Error { }
export class UpdateRevisionError extends Error { }
export class DeleteRevisionError extends Error { }
