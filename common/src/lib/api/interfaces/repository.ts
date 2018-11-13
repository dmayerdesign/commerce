import { Response as IResponse } from 'express'
import { Document, Model } from 'mongoose'
import { MongooseDocument } from '../../goosetype/models/mongoose-document'
import { ListRequest } from '../requests/list.request'
import { UpdateManyRequest } from '../requests/update-many.request'
import { UpdateRequest } from '../requests/update.request'

export interface QbRepository<EntityType extends Document> {
  configureForGoosetypeEntity(entityConstructor: typeof MongooseDocument): void
  configureForMongooseModel(model: Model<EntityType>): void
  get(primaryKey: string): Promise<EntityType>
  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>
  stream(listRequest: ListRequest<EntityType>, response?: IResponse): Promise<void>
  insert(body: EntityType[]): Promise<EntityType[]>
  updateMany(updateManyRequest: UpdateManyRequest<EntityType>): Promise<EntityType[]>
  update(updateRequest: UpdateRequest<EntityType>): Promise<EntityType>
  deleteMany(primaryKeys: string[]): Promise<EntityType[]>
  delete(primaryKey: string): Promise<EntityType>
}

export const DB_CONNECTION = 'DbConnection'

