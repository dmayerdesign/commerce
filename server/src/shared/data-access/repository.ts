import { Injectable } from '@nestjs/common'
import { QbRepository as IQbRepository } from '@qb/common/api/interfaces/repository'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { UpdateManyRequest } from '@qb/common/api/requests/update-many.request'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { isArrayLike, toArray } from '@qb/common/helpers/mongoose.helpers'
import { getMongoRepository, DeepPartial, DeleteWriteOpResultObject, FindManyOptions, MongoRepository, ObjectID, UpdateWriteOpResult } from 'typeorm'

interface QbEntityType {
  id: ObjectID
}

@Injectable()
export class QbRepository<EntityType extends QbEntityType> implements IQbRepository<EntityType> {
  private _repository: MongoRepository<EntityType>

  public configureForTypeOrmEntity(entityType: any): void {
    this._repository = getMongoRepository(entityType)
  }

  public get(id: string): Promise<EntityType> {
    return this._repository.findOne(id)
  }

  public async list(listRequest: ListRequest<EntityType>): Promise<EntityType[]> {
    return this._repository.find(this._createFindManyOptions(listRequest))
  }

  // TODO: Figure out streaming with TypeORM.
  // public async stream(
  //   listRequest: ListRequest<EntityType>,
  //   response: IResponse,
  // ): Promise<void> {
  //   const cursor = this._repository.createCursor<EntityType>(query as Query<EntityType>)
  //   return cursor
  //     .pipe(JSONStream.stringify())
  //     .pipe(response.contentType('json'))
  // }

  public async insert(body: DeepPartial<EntityType>[]): Promise<DeepPartial<EntityType>[]> {
    const documents = body.map((value) => this._repository.create(value))
    return this._repository.save<DeepPartial<EntityType>>(documents as any[])
  }

  public async updateMany(updateManyRequest: UpdateManyRequest<EntityType>): Promise<UpdateWriteOpResult> {
    const { ids, update, unsafeArrayUpdates } = updateManyRequest
    const updateManyOperation: { $set: any, $addToSet?: any } = {
      $set: update
    }

    if (unsafeArrayUpdates) {
      let includeAddToSet = false
      const $addToSet: { [key: string]: any[] } = {}

      Object.keys(update).forEach((key) => {
        if (isArrayLike(update[key])) {
            includeAddToSet = true
            $addToSet[key] = toArray(update[key])
            delete update[key]
        }
      })

      if (includeAddToSet) {
        updateManyOperation.$addToSet = $addToSet
      }
    }

    return this._repository.updateMany({ id: { $in: ids } }, updateManyOperation)
  }

  public async update(updateRequest: UpdateRequest<EntityType>): Promise<UpdateWriteOpResult> {
    const { id, update, unsafeArrayUpdates } = updateRequest
    const updateOperation: { $set: any, $addToSet?: any } = {
      $set: update
    }

    if (unsafeArrayUpdates) {
      let includeAddToSet = false
      const $addToSet: { [key: string]: any[] } = {}

      Object.keys(update).forEach((key) => {
        if (isArrayLike(update[key])) {
            includeAddToSet = true
            $addToSet[key] = toArray(update[key])
            delete update[key]
        }
      })

      if (includeAddToSet) {
        updateOperation.$addToSet = $addToSet
      }

    }

    return this._repository.updateOne(id, updateOperation)
  }

  public deleteMany(primaryKeys: ObjectID[]): Promise<DeleteWriteOpResultObject> {
    return this._repository.deleteMany({ _id: { $in: primaryKeys } })
  }

  public delete(primaryKey: ObjectID): Promise<DeleteWriteOpResultObject> {
    return this._repository.deleteOne(primaryKey)
  }

  // Convenience methods.

  public lookup(key: string, value: any): Promise<EntityType> {
    return this._repository.findOne({ [key]: value })
  }

  public textSearch({
    search,
    searchFields,
    skip,
    limit,
    sortBy,
    sortDirection,
  }: ListRequest<EntityType>): Promise<EntityType[]> {
    const searchQuery = { $and: [] }
    const searchRegExp = search ? new RegExp(search, 'gi') : undefined
    const searchQueryElements: {
      [key: string]: { $regex: RegExp }
    }[] = []

    if (searchRegExp) {
      searchFields.forEach((searchField) => {
        searchQueryElements.push({
          [searchField]: {
            $regex: searchRegExp
          }
        })
      })
      searchQuery.$and = searchQuery.$and.concat(searchQueryElements)
    }

    const request = new ListRequest<EntityType>({
      skip,
      limit,
      sortBy,
      sortDirection,
      query: searchQuery
    })

    return this.list(request)
  }

  private _createFindManyOptions(listRequest: ListRequest<EntityType>): FindManyOptions<EntityType> {
    const {
      skip,
      limit,
      sortBy,
      sortDirection,
      query
    } = listRequest

    return {
      skip,
      take: limit,
      where: query,
      order: {
        [sortBy]: sortDirection
      } as { [P in keyof EntityType]?: 1 | -1; }
    }
  }
}
