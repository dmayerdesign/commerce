import { DeepPartial, ObjectID } from 'typeorm'
import { ListRequest } from '../requests/list.request'
import { UpdateManyRequest } from '../requests/update-many.request'
import { UpdateRequest } from '../requests/update.request'

export interface QbBaseRepository<EntityType extends any> {
  get(primaryKey: string | ObjectID): Promise<EntityType>
  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>
  // TODO: Figure out streaming with TypeORM.
  // stream(listRequest: ListRequest<EntityType>, response?: IResponse): Promise<void>
  insert(body: DeepPartial<EntityType>[]): Promise<DeepPartial<EntityType>[]>
  updateMany(updateManyRequest: UpdateManyRequest<EntityType>): Promise<any>
  update(updateRequest: UpdateRequest<EntityType>): Promise<any>
  deleteMany(primaryKeys: (string | ObjectID)[]): Promise<any>
  delete(primaryKey: string | ObjectID): Promise<any>
}

export interface QbRepository<EntityType> extends QbBaseRepository<EntityType> {
  configureForTypeOrmEntity(entity: any): void
}

export interface QbThirdPartyRepository<EntityType> extends QbBaseRepository<EntityType> { }

export interface QbReadOnlyRepository<EntityType> {
  list(listRequest: ListRequest<EntityType>): Promise<EntityType[]>
  get?(primaryKey: string): Promise<EntityType>
}
