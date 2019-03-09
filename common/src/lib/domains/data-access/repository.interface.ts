import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { UpdateManyRequest } from '@qb/common/domains/data-access/requests/update-many.request'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import { DeleteWriteOpResultObject, InsertOneWriteOpResult, InsertWriteOpResult, ObjectId, UpdateWriteOpResult } from 'mongodb'
import { DeepPartial } from 'typeorm'

export type InclusivePartial<Type> = Partial<Type> & DeepPartial<Type>

export interface BaseRepository<EntityType extends any> {
  get(primaryKey: string | ObjectId): Promise<EntityType | undefined>

  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>

  insertMany(body: DeepPartial<EntityType>[]): Promise<InsertWriteOpResult>

  insert(body: DeepPartial<EntityType>): Promise<InsertOneWriteOpResult>

  updateMany(updateManyRequest: UpdateManyRequest<EntityType>): Promise<UpdateWriteOpResult>

  update(updateRequest: UpdateRequest<EntityType>): Promise<UpdateWriteOpResult>

  deleteMany(primaryKeys: (string | ObjectId)[]): Promise<DeleteWriteOpResultObject>

  delete(primaryKey: string | ObjectId): Promise<DeleteWriteOpResultObject>

  // TODO: Figure out streaming with TypeORM.
  // stream(listRequest: ListRequest<EntityType>, response?: IResponse): Promise<void>
}

export interface Repository<EntityType> extends BaseRepository<EntityType> {
}

export interface ThirdPartyRepository<EntityType> extends BaseRepository<EntityType> { }

export interface ReadOnlyRepository<EntityType> {
  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>
  get?(primaryKey: string): Promise<EntityType>
}
