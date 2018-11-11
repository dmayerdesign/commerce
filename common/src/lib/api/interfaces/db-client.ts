import { MongooseDocument } from '@qb/common/goosetype/models/mongoose-document'
import { Request as IRequest, Response as IResponse } from 'express'
import { Document, Model } from 'mongoose'

export interface DbClient<EntityType extends Document> {
  configureForGoosetypeEntity(entityConstructor: typeof MongooseDocument): void
  configureForMongooseModel(model: Model<EntityType>): void
  get(request: IRequest, response: IResponse): Promise<EntityType>
  list(request: IRequest, response: IResponse): Promise<EntityType[]>
  create(request: IRequest, response: IResponse): Promise<EntityType[]>
  updateMany(request: IRequest, response: IResponse): Promise<EntityType[]>
  update(request: IRequest, response: IResponse): Promise<EntityType>
  deleteMany(request: IRequest, response: IResponse): Promise<EntityType[]>
  delete(request: IRequest, response: IResponse): Promise<EntityType>
}

export const DB_CLIENT = 'DbClient'
export const DB_CONNECTION = 'DbConnection'

