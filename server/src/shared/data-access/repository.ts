import { Entity } from '@qb/common/domains/data-access/entity.interface'
import { InclusivePartial, QbRepository as IQbRepository } from '@qb/common/domains/data-access/repository.interface'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { UpdateManyRequest } from '@qb/common/domains/data-access/requests/update-many.request'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import { toArray } from '@qb/common/helpers/mongoose.helpers'
import { DeleteWriteOpResultObject, InsertOneWriteOpResult, InsertWriteOpResult, ObjectId,
  UpdateWriteOpResult } from 'mongodb'
import { DeepPartial, FindManyOptions, MongoRepository,
  ObjectID as TypeOrmObjectId } from 'typeorm'

export abstract class QbRepository<EntityType extends Entity> implements IQbRepository<EntityType> {

  // Hooks.
  private _preGetHooks: ((id?: string | ObjectId) => Promise<void>)[] = []
  private _postGetHooks: ((doc?: EntityType) => Promise<void>)[] = []
  private _preListHooks: ((listRequest: ListRequest<EntityType>) => Promise<void>)[] = []
  private _postListHooks: ((docs?: EntityType[]) => Promise<void>)[] = []
  private _preInsertHooks: ((preInsertDoc?: EntityType) => Promise<void>)[] = []
  private _postInsertHooks: ((doc?: EntityType) => Promise<void>)[] = []
  private _preUpdateHooks: (({ id, update }: UpdateRequest<EntityType>) => Promise<void>)[] = []
  private _postUpdateHooks: ((doc?: EntityType) => Promise<void>)[] = []
  private _preUpdateManyHooks: (({ ids, update }: UpdateManyRequest<EntityType>) => Promise<void>)[] = []
  private _postUpdateManyHooks: ((updatedDocs?: EntityType[]) => Promise<void>)[] = []

  constructor(
    protected readonly _repository: MongoRepository<EntityType>
  ) { }

  public async get(id: string | ObjectId): Promise<EntityType | undefined> {
    for (const preGetHook of this._preGetHooks) await preGetHook(id)
    const doc = await this._repository.findOne(id as TypeOrmObjectId)
    for (const postGetHook of this._postGetHooks) await postGetHook(doc)
    return doc
  }

  public async list(listRequest: ListRequest<EntityType>): Promise<EntityType[]> {
    for (const preListHook of this._preListHooks) await preListHook(listRequest)
    const docs = await this._repository.find(this._createFindManyOptions(listRequest))
    for (const postListHook of this._postListHooks) await postListHook(docs)
    return docs
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
    for (const preInsertHook of this._preInsertHooks) await preInsertHook(document)
    const insertResult = await this._repository.insertOne(document)
    if (this._postInsertHooks.length) {
      const insertedDoc = await this.get(insertResult.insertedId)
      for (const postInsertHook of this._postInsertHooks) await postInsertHook(insertedDoc)
    }
    return insertResult
  }

  public async insertAndGet(body: DeepPartial<EntityType>): Promise<EntityType> {
    const insertOneResult = await this.insert(body)
    return this.get(insertOneResult.insertedId) as Promise<EntityType>
  }

  public async insertMany(body: DeepPartial<EntityType>[]): Promise<InsertWriteOpResult> {
    const documents = body.map((value) => this.create(value))
    return this._repository.insertMany(documents)
  }

  public async insertManyAndList(body: DeepPartial<EntityType>[]): Promise<EntityType[]> {
    const insertManyResult = await this.insertMany(body)
    return this._repository.find(this._createFindManyOptions(
      new ListRequest({
        ids: toArray(insertManyResult.insertedIds as ObjectId[])
      })
    ))
  }

  public async updateMany(
    { ids, update }: UpdateManyRequest<EntityType>
  ): Promise<UpdateWriteOpResult> {
    for (const preUpdateManyHook of this._preUpdateManyHooks) {
      await preUpdateManyHook({ ids, update })
    }
    const updateManyResult = await this._repository.updateMany(
      { id: { $in: ids } },
      { $set: update },
    )
    if (this._postUpdateManyHooks.length) {
      const updatedDocs = await this.list(new ListRequest({ ids }))
      for (const postUpdateManyHook of this._postUpdateManyHooks) {
        await postUpdateManyHook(updatedDocs)
      }
    }
    return updateManyResult
  }

  public async updateManyAndList(
    updateManyRequest: UpdateManyRequest<EntityType>
  ): Promise<EntityType[]> {
    await this.updateMany(updateManyRequest)
    return this.list(new ListRequest({ ids: updateManyRequest.ids }))
  }

  public async update(
    { id, update }: UpdateRequest<EntityType>
  ): Promise<UpdateWriteOpResult> {
    for (const preUpdateHook of this._preUpdateHooks) await preUpdateHook({ id, update })
    const updateResult = await this._repository.updateOne({ id }, { $set: update })
    if (this._postUpdateHooks.length) {
      const updatedDoc = await this.get(id)
      for (const postUpdateHook of this._postUpdateHooks) await postUpdateHook(updatedDoc)
    }
    return updateResult
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

  public registerPreGetHook(
    hookFn: (id?: string | ObjectId) => Promise<void>
  ): void {
    this._preGetHooks.push(hookFn)
  }
  public registerPostGetHook(
    hookFn: (doc?: EntityType) => Promise<void>
  ): void {
    this._postGetHooks.push(hookFn)
  }
  public registerPreListHook(
    hookFn: (listRequest: ListRequest<EntityType>) => Promise<void>
  ): void {
    this._preListHooks.push(hookFn)
  }
  public registerPostListHook(
    hookFn: (docs?: EntityType[]) => Promise<void>
  ): void {
    this._postListHooks.push(hookFn)
  }
  public registerPreInsertHook(
    hookFn: (preInsertDoc?: EntityType) => Promise<void>
  ): void {
    this._preInsertHooks.push(hookFn)
  }
  public registerPostInsertHook(
    hookFn: (doc?: EntityType) => Promise<void>
  ): void {
    this._postInsertHooks.push(hookFn)
  }
  public registerPreUpdateHook(
    hookFn: ({ id, update }: UpdateRequest<EntityType>) => Promise<void>
  ): void {
    this._preUpdateHooks.push(hookFn)
  }
  public registerPostUpdateHook(
    hookFn: (doc?: EntityType) => Promise<void>
  ): void {
    this._postUpdateHooks.push(hookFn)
  }
  public registerPreUpdateManyHook(
    hookFn: ({ ids, update }: UpdateManyRequest<EntityType>) => Promise<void>
  ): void {
    this._preUpdateManyHooks.push(hookFn)
  }
  public registerPostUpdateManyHook(
    hookFn: (updatedDocs?: EntityType[]) => Promise<void>
  ): void {
    this._postUpdateManyHooks.push(hookFn)
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
