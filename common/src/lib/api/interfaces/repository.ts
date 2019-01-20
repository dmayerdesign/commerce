import { DeepPartial, ObjectID } from 'typeorm'
import { ListRequest } from '../requests/list.request'
import { UpdateManyRequest } from '../requests/update-many.request'
import { UpdateRequest } from '../requests/update.request'

export type InclusivePartial<Type> = Partial<Type> & DeepPartial<Type>

export interface QbBaseRepository<EntityType extends any> {
  get(primaryKey: string | ObjectID): Promise<EntityType | undefined>
  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>
  insertMany(body: DeepPartial<EntityType>[]): Promise<EntityType[]>
  insert(body: DeepPartial<EntityType>): Promise<EntityType>
  updateMany(updateManyRequest: UpdateManyRequest<EntityType>): Promise<EntityType[]>
  update(updateRequest: UpdateRequest<EntityType>): Promise<EntityType>
  deleteMany(primaryKeys: (string | ObjectID)[]): Promise<any>
  delete(primaryKey: string | ObjectID): Promise<any>
  // TODO: Figure out streaming with TypeORM.
  // stream(listRequest: ListRequest<EntityType>, response?: IResponse): Promise<void>
}

export interface QbRepository<EntityType> extends QbBaseRepository<EntityType> {
}

export interface QbThirdPartyRepository<EntityType> extends QbBaseRepository<EntityType> { }

export interface QbReadOnlyRepository<EntityType> {
  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>
  get?(primaryKey: string): Promise<EntityType>
}
