import { Entity } from '@qb/common/api/interfaces/entity'
import { InclusivePartial, QbRepository as IQbRepository } from '@qb/common/api/interfaces/repository'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { UpdateManyRequest } from '@qb/common/api/requests/update-many.request'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { isArrayLike, toArray } from '@qb/common/helpers/mongoose.helpers'
import { DeepPartial, DeleteWriteOpResultObject, FindManyOptions, MongoRepository, ObjectID } from 'typeorm'

export abstract class QbRepository<EntityType extends Entity> implements IQbRepository<EntityType> {

  constructor(
    protected readonly _repository: MongoRepository<EntityType>
  ) { }

  public get(id: string | ObjectID): Promise<EntityType | undefined> {
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
  public create(body: DeepPartial<EntityType>): EntityType {
    return this._repository.create(body)
  }

  public async insert(body: DeepPartial<EntityType>): Promise<EntityType> {
    const document = this.create(body)
    const insertOneResult = await this._repository.insertOne(document)
    return this.get(insertOneResult.insertedId) as Promise<EntityType>
  }

  public async insertMany(body: DeepPartial<EntityType>[]): Promise<EntityType[]> {
    const documents = body.map((value) => this.create(value))
    const insertManyResult = await this._repository.insertMany(documents as any[])
    return this._repository.find(this._createFindManyOptions(
      new ListRequest({ ids: insertManyResult.insertedIds })
    ))
  }

  public async updateMany(updateManyRequest: UpdateManyRequest<EntityType>): Promise<EntityType[]> {
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

    await this._repository.updateMany(
      { id: { $in: ids } },
      updateManyOperation
    )

    return this.list(new ListRequest({ ids }))
  }

  public async update(
    updateRequest: UpdateRequest<EntityType>
  ): Promise<EntityType> {
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

    const { upsertedId } = await this._repository
      .updateOne(id, updateOperation)

    return this.get(upsertedId._id) as Promise<EntityType>
  }

  public deleteMany(primaryKeys: ObjectID[]): Promise<DeleteWriteOpResultObject> {
    return this._repository.deleteMany({ _id: { $in: primaryKeys } })
  }

  public delete(primaryKey: ObjectID): Promise<DeleteWriteOpResultObject> {
    return this._repository.deleteOne(primaryKey)
  }

  // Convenience methods.

  public async getOrCreate(docOrQuery: object): Promise<EntityType> {
    const existingDoc = await this._repository.findOne(docOrQuery as InclusivePartial<EntityType>)
    if (existingDoc) {
      return existingDoc
    }
    const newDocs = await this.insert(docOrQuery)
    return newDocs[0]
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
