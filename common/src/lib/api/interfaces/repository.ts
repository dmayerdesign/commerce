import { Response as IResponse } from 'express'
import { Document, Model } from 'mongoose'
import { MongooseDocument } from '../../goosetype/models/mongoose-document'
import { ListRequest } from '../requests/list.request'
import { UpdateManyRequest } from '../requests/update-many.request'
import { UpdateRequest } from '../requests/update.request'

export interface QbBaseRepository<EntityType extends any> {
  get(primaryKey: string): Promise<EntityType>
  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>
  stream(listRequest: ListRequest<EntityType>, response?: IResponse): Promise<void>
  insert(body: EntityType[]): Promise<EntityType[]>
  updateMany(updateManyRequest: UpdateManyRequest<EntityType>): Promise<EntityType[]>
  update(updateRequest: UpdateRequest<EntityType>): Promise<EntityType>
  deleteMany(primaryKeys: string[]): Promise<EntityType[]>
  delete(primaryKey: string): Promise<EntityType>
}

export interface QbRepository<EntityType extends Document> extends QbBaseRepository<EntityType> {
  configureForGoosetypeEntity(entityConstructor: typeof MongooseDocument): void
  configureForMongooseModel(model: Model<EntityType>): void
}

export interface QbThirdPartyRepository<EntityType> extends QbBaseRepository<EntityType> { }

export interface QbReadOnlyRepository<EntityType> {
  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>
  get?(primaryKey: string): Promise<EntityType>
}
