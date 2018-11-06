import { ListFromIdsRequest, ListFromQueryRequest, ListFromSearchRequest } from '@mte/common/api/requests/list.request'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { ApiResponse } from '@mte/common/api/responses/api.response'
import { MongooseDocument } from '@mte/common/lib/goosetype'
import { Response } from 'express'
import { injectable } from 'inversify'
import { DbClient } from '../data-access/db-client'

/**
 * Base class for API services requiring CRUD functionality.
 */
@injectable()
export abstract class CrudService<T extends MongooseDocument> {

    protected abstract model: typeof MongooseDocument
    protected abstract dbClient: DbClient<T>

    protected listRequestType = ListFromQueryRequest
    protected listFromIdsRequestType = ListFromIdsRequest
    protected searchRequestType = ListFromSearchRequest

    public async get(requestObject: ListFromQueryRequest, res?: Response): Promise<ApiResponse<T[]>> {
        const request = new this.listRequestType(requestObject)

        try {
            const data = await this.dbClient.findQuery<T>(this.model, request, res)
            return new ApiResponse(data)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async search(requestObject: ListFromSearchRequest, res?: Response): Promise<ApiResponse<T[]>> {
        const request = new this.searchRequestType(requestObject)

        try {
            const data = await this.dbClient.findWithSearch<T>(this.model, request, res)
            return new ApiResponse(data)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async getIds(requestObject: ListFromIdsRequest): Promise<ApiResponse<T[]>> {
        const request = new this.listFromIdsRequestType(requestObject)

        try {
            const data = await this.dbClient.findIds<T>(this.model, request)
            return new ApiResponse(data)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async getOne(id: string): Promise<ApiResponse<T>> {
        try {
            const data = await this.dbClient.findById<T>(this.model, id)
            return new ApiResponse(data)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async create(docs: T[]): Promise<ApiResponse<T[]>> {
        try {
            const newDocs = await this.dbClient.create<T>(this.model, docs)
            return new ApiResponse(newDocs)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async createOne(doc: T): Promise<ApiResponse<T>> {
        try {
            const newDoc = await new (this.model as any)(doc).save()
            return new ApiResponse(newDoc)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async update(ids: string[], updateObj: object, concatArrays?: boolean): Promise<ApiResponse<T[]>> {
        try {
            const updatedDocs = await this.dbClient.update<T>(this.model, ids, updateObj, concatArrays)
console.log('UPDATED', updateObj, updatedDocs)
            return new ApiResponse(updatedDocs)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async updateOne(id: string, updateObj: object, concatArrays?: boolean): Promise<ApiResponse<T>> {
        try {
            const updatedDoc = await this.dbClient.updateById<T>(this.model, id, updateObj, concatArrays)
            return new ApiResponse(updatedDoc)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async deleteOne(id: string): Promise<ApiResponse<void>> {
        try {
            await this.dbClient.delete(this.model, id)
            return new ApiResponse<void>()
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }
}
