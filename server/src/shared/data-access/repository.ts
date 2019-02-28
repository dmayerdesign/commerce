import { Entity } from '@qb/common/domains/data-access/entity.interface'
import { InclusivePartial, QbRepository as IQbRepository } from '@qb/common/domains/data-access/repository.interface'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { UpdateManyRequest } from '@qb/common/domains/data-access/requests/update-many.request'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import { isArrayLike, toArray } from '@qb/common/helpers/mongoose.helpers'
import { InsertOneWriteOpResult, InsertWriteOpResult, ObjectId, UpdateWriteOpResult } from 'mongodb'
import { DeepPartial, DeleteWriteOpResultObject, FindManyOptions, MongoRepository, ObjectID as TypeOrmObjectId } from 'typeorm'

export abstract class QbRepository<EntityType extends Entity> implements IQbRepository<EntityType> {

  constructor(
    protected readonly _repository: MongoRepository<EntityType>
  ) { }

  public get(id: string | ObjectId): Promise<EntityType | undefined> {
    return this._repository.findOne(id as TypeOrmObjectId)
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
  public create(body: DeepPartial<EntityType>): EntityType {
    return this._repository.create(body)
  }

  public async insert(body: DeepPartial<EntityType>): Promise<InsertOneWriteOpResult> {
    const document = this.create(body)
    return this._repository.insertOne(document)
  }

  public async insertAndGet(body: DeepPartial<EntityType>): Promise<EntityType> {
    const insertOneResult = await this.insert(body)
    return this.get(insertOneResult.insertedId) as Promise<EntityType>
  }

  public async insertMany(body: DeepPartial<EntityType>[]): Promise<InsertWriteOpResult> {
    const documents = body.map((value) => this.create(value))
    return this._repository.insertMany(documents as any[])
  }

  public async insertManyAndList(body: DeepPartial<EntityType>[]): Promise<EntityType[]> {
    const insertManyResult = await this.insertMany(body)
    return this._repository.find(this._createFindManyOptions(
      new ListRequest({ ids: Array.from(insertManyResult.insertedIds as ObjectId[]) })
    ))
  }

  public async updateMany(
    updateManyRequest: UpdateManyRequest<EntityType>
  ): Promise<UpdateWriteOpResult> {
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

    return this._repository.updateMany(
      { id: { $in: ids } },
      updateManyOperation
    )
  }

  public async updateManyAndList(
    updateManyRequest: UpdateManyRequest<EntityType>
  ): Promise<EntityType[]> {
    await this.updateMany(updateManyRequest)
    return this.list(new ListRequest({ ids: updateManyRequest.ids }))
  }

  public async update(
    updateRequest: UpdateRequest<EntityType>
  ): Promise<UpdateWriteOpResult> {
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

    return this._repository
      .updateOne(id, updateOperation)
  }

  public async updateAndGet(
    updateRequest: UpdateRequest<EntityType>
  ): Promise<EntityType> {
    const { upsertedId } = await this.update(updateRequest)
    return this.get(upsertedId._id) as Promise<EntityType>
  }

  public deleteMany(primaryKeys: ObjectId[]): Promise<DeleteWriteOpResultObject> {
    return this._repository.deleteMany({ _id: { $in: primaryKeys } })
  }

  public delete(primaryKey: ObjectId): Promise<DeleteWriteOpResultObject> {
    return this._repository.deleteOne(primaryKey)
  }

  // Convenience methods.

  public async getOrCreate(docOrQuery: object): Promise<EntityType> {
    const existingDoc = await this._repository.findOne(docOrQuery as InclusivePartial<EntityType>)
    if (existingDoc) {
      return existingDoc
    }
    const newDoc = await this.insertAndGet(docOrQuery)
    return newDoc
  }

  public lookup(key: keyof EntityType, value: any): Promise<EntityType | undefined> {
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
    interface SearchQueryElement {
      [key: string]: { $regex: RegExp }
    }
    const searchQuery = { $and: [] as SearchQueryElement[] }
    const searchRegExp = search ? new RegExp(search, 'gi') : undefined
    const searchQueryElements: SearchQueryElement[] = []

    if (searchRegExp && searchFields) {
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

  private _createFindManyOptions(listRequest: ListRequest<EntityType>):
    FindManyOptions<EntityType> {
    type OrderFindMany = {
      [P in keyof EntityType]?: 1 | -1
    }
    const {
      skip,
      limit,
      sortBy,
      sortDirection,
      query
    } = listRequest
    let order: OrderFindMany | undefined

    if (sortBy) {
      order = {
        [sortBy as keyof EntityType]: sortDirection
      } as OrderFindMany
    }

    return {
      skip,
      take: limit,
      where: query,
      order
    }
  }
}
