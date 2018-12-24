import { model, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'

@model(MongooseSchemaOptions.timestamped)
export class Test extends MongooseDocument {
    @prop() public name: string
}

export class CreateTestError extends Error { }
export class FindTestError extends Error { }
export class UpdateTestError extends Error { }
export class DeleteTestError extends Error { }
