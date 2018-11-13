import { Injectable } from '@nestjs/common'
import { PopulateOptions } from '@qb/common/api/interfaces/populate-options'
import { QbRepository as IQbRepository } from '@qb/common/api/interfaces/repository'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { UpdateManyRequest } from '@qb/common/api/requests/update-many.request'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { MongooseDocument } from '@qb/common/goosetype/models/mongoose-document'
import { isArrayLike, toArray } from '@qb/common/helpers/mongoose.helper'
import * as JSONStream from 'JSONStream'
import { Response as IResponse } from 'express'
import { Document, DocumentQuery, Model } from 'mongoose'

@Injectable()
export class QbRepository<EntityType extends Document> implements IQbRepository<EntityType> {
  private _model: Model<EntityType>

  public configureForGoosetypeEntity(entityConstructor: typeof MongooseDocument): void {
    this.configureForMongooseModel(entityConstructor.getModel())
  }
  public configureForMongooseModel(model: Model<EntityType>): void {
    this._model = model
  }

  public get(id: string): Promise<EntityType> {
    return this._model.findById(id).exec()
  }

  public async list(listRequest: ListRequest<EntityType>): Promise<EntityType[]> {
    return this._model.find(this._createListQuery(listRequest)).exec()
  }

  public async stream(
    listRequest: ListRequest<EntityType>,
    response: IResponse,
  ): Promise<void> {
    return this._createListQuery(listRequest)
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(response.contentType('json'))
  }

  public async insert(body: (EntityType | Partial<EntityType>)[]): Promise<EntityType[]> {
    const documents = body.map((value) => new this._model(value))
    return Promise.all(documents.map((document) => document.save()))
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

      return this._model.updateMany({ _id: { $in: ids } }, updateManyOperation).exec()
    }
    else {
      return this._model.updateMany({ _id: { $in: ids } }, updateManyOperation).exec()
    }
  }

  public async update(updateRequest: UpdateRequest<EntityType>): Promise<EntityType> {
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

      return this._model.update({ _id: id }, updateOperation).exec()
    }
    else {
      return this._model.update({ _id: id }, updateOperation).exec()
    }
  }

  public deleteMany(primaryKeys: string[]): Promise<EntityType[]> {
    return this._model.remove({ _id: { $in: primaryKeys } }).exec()
  }

  public delete(primaryKey: string): Promise<EntityType> {
    return this._model.findByIdAndRemove(primaryKey).exec()
  }

  // Convenience methods.

  public lookup(key: string, value: any, populates?: PopulateOptions[]): Promise<EntityType> {
    const query = this._model.findOne({ [key]: value })
    if (populates) {
      populates.forEach((populateOptions) => {
        query.populate(populateOptions)
      })
    }
    return query.exec()
  }

  public textSearch(
    _model: typeof MongooseDocument,
    { search, searchFields, skip, limit, sortBy, sortDirection }: ListRequest<EntityType>,
    response: IResponse
  ): Promise<void> {
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

    return this.stream(request, response)
  }

  public async upsert(body: Partial<EntityType>): Promise<EntityType> {
    const doc = await this.get(body._id)
    if (doc) {
      return doc
    }
    else {
      return (await this.insert([ body ])[0])
    }
  }

  private _createListQuery(listRequest: ListRequest<EntityType>): DocumentQuery<EntityType[], EntityType> {
    const {
      skip,
      limit,
      sortBy,
      sortDirection,
      query,
      populates
    } = listRequest

    const findQuery = this._model.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortDirection })

    if (populates) {
      populates.forEach((populateOptions) => {
        findQuery.populate(populateOptions)
      })
    }

    return findQuery
  }
}
