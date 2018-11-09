import { SchemaError } from '@mte/common/api/errors'
import { PopulateOptions } from '@mte/common/api/interfaces/populate-options'
import { ListFromIdsRequest, ListFromQueryRequest, ListFromSearchRequest } from '@mte/common/api/requests/list.request'
import { Copy } from '@mte/common/constants/copy'
import { MongooseDocument, MongooseModel } from '@mte/common/lib/goosetype'
import * as JSONStream from 'JSONStream'
import { Response } from 'express'
import { injectable } from 'inversify'
import { Document, Error, Types } from 'mongoose'

/**
 * Methods for querying the database
 *
 * @export
 * @class DbClient
 * @template T
 */
@injectable()
export class DbClient<RecordType extends MongooseDocument> {

    private async loadOrStream<RecordType = RecordType>(
        model: MongooseModel<RecordType>,
        request: ListFromQueryRequest,
        res: Response,
        populateOptionsArr?: (PopulateOptions | string)[],
    ): Promise<RecordType[]> {
        const {
            skip,
            limit,
            sortBy,
            sortDirection,
            query,
        } = request

        const findQuery = model.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortDirection })

        if (populateOptionsArr) {
            populateOptionsArr.forEach((populateOptions) => {
                findQuery.populate(populateOptions)
            })
        }

        if (res) {
            try {
                findQuery
                    .cursor()
                    .pipe(JSONStream.stringify())
                    .pipe(res.contentType('json'))

                return
            }
            catch (streamError) {
                throw streamError
            }
        }

        // Fetch the data normally.

        else {
            try {
                const documents = await findQuery.exec()

                return documents as (RecordType & Document)[]
            }
            catch (fetchError) {
                throw fetchError
            }
        }
    }

    /**
     * Gets a paginated and filtered set of documents from a collection
     *
     * @param {mongoose.Model} model - Mongoose `Model` to query
     * @param {object} query - The database query
     * @param {boolean} res - Pass the express `Response` if the set of documents should be streamed rather than loaded into memory
     */
    public findQuery<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, requestObject: ListFromQueryRequest, res?: Response, populateOptionsArr?: (PopulateOptions | string)[]): Promise<T[]> {
        const model = _model.__model
        let request = requestObject
        if (!(requestObject instanceof ListFromQueryRequest)) {
            request = new ListFromQueryRequest(requestObject)
        }
        return this.loadOrStream<T>(model, request, res, populateOptionsArr)
    }

    /**
     * Find some documents using a search string
     *
     * @param {MongooseModel<T>} model The Mongoose `Model` representing the collection containing the document
     * @param {ListRequest} request
     * @memberof DbClient
     */
    public async findWithSearch<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, { search, searchFields, skip, limit, sortBy, sortDirection }: ListFromSearchRequest, res?: Response): Promise<T[]> {
        const model = _model.__model
        try {
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

            const request = new ListFromQueryRequest({
                skip,
                limit,
                sortBy,
                sortDirection,
                query: searchQuery
            })
            const documents: T[] = await this.loadOrStream<T>(model, request, res)
            return documents
        }
        catch (error) {
            throw error
        }
    }

    /**
     * Find some documents using an array of `ObjectId`s
     *
     * @param {MongooseModel<T>} model The Mongoose `Model` representing the collection containing the document
     * @param {string[]} ids An array of `ObjectId`s
     * @memberof DbClient
     */
    public async findIds<T extends MongooseDocument = RecordType>(
        _model: typeof MongooseDocument,
        { skip, limit, sortBy, sortDirection, ids }: ListFromIdsRequest,
        populateOptionsArr?: (PopulateOptions | string)[]
    ): Promise<T[]> {
        try {
            return await this.findQuery<T>(_model, new ListFromQueryRequest({
                skip,
                limit,
                sortBy,
                sortDirection,
                query: { _id: { $in: ids } },
            }), null, populateOptionsArr)
        }
        catch (error) {
            throw error
        }
    }

    /**
     * Find a document. Optionally, perform a series of Mongoose `populate`s.
     *
     * @param {MongooseModel<T>} model The Mongoose `Model` representing the collection containing the document
     * @param {object} query The query passed to `Model.findOne`
     * @memberof DbClient
     */
    public async findOne<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, query: object, populateOptionsArr?: (PopulateOptions | string)[]): Promise<T> {
        const model = _model.__model
        let notFound = false
        try {
            const findQuery = model.findOne(query)

            if (populateOptionsArr) {
                populateOptionsArr.forEach((populateOptions) => {
                    findQuery.populate(populateOptions)
                })
            }

            const documentResult = await findQuery.exec()
            if (documentResult) {
                const document = documentResult
                return document
            }
            else {
                notFound = true
                throw new Error(Copy.ErrorMessages.documentNotFound)
            }
        }
        catch (error) {
            if (notFound) {
                return null
            }
            else {
                throw error
            }
        }
    }

    /**
     * Find a document by `id`
     *
     * @param {MongooseModel<T>} model The Mongoose `Model` representing the collection containing the document
     * @param {string} id The id passed to `Model.findById`
     * @memberof DbClient
     */
    public async findById<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, id: string): Promise<T> {
        const model = _model.__model
        try {
            const documentResult: any = await model.findById(id).exec()
            if (documentResult) {
                const document: T = documentResult
                return document
            }
            else {
                throw new Error('Document not found.')
            }
        }
        catch (error) {
            throw error
        }
    }

    /**
     * Find or create a document.
     *
     * @param {MongooseModel<T>} model The Mongoose `Model` representing the collection containing the document
     * @param {string} query The 'find' query passed to `Model.findOrCreate`
     * @memberof DbClient
     */
    public async findOrCreate<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, query: object): Promise<T> {
        const model = _model.__model

        try {
            const documentResult = await model.findOrCreate(query)
            if (documentResult) {
                const document: T = documentResult.doc
                return document
            }
            else {
                throw new Error('FindOrCreate failed.')
            }
        }
        catch (error) {
            throw error
        }
    }

    /**
     * Update multiple documents.
     *
     * @param {mongoose.Model} model The Mongoose `Model` representing the collection containing the document
     * @param {ObjectId|string} ids An array of `_id`s representing the docs to be updated.
     * @param {object} update An object representing the fields to be updated
     * @param {boolean} addToArrays Set to `false` if fields should be replaced in the same way as other fields, using a MongoDB `$set`. Defaults to `true`, meaning that fields containing arrays are treated as additions to the existing array using MongoDB's `$addToSet` operator
     * @memberof DbClient
     */
    public async update<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, ids: (string|Types.ObjectId)[], update: object, addToArrays = true): Promise<T[]> {
        const model = _model.__model
        let documents: T[]

        if (addToArrays) {
            let includeAddToSet = false
            const $addToSet: { [key: string]: any[] } = {}

            Object.keys(update).forEach((key) => {
                if (Array.isArray(update[key])) {
                    includeAddToSet = true
                    $addToSet[key] = [ ...update[key] ]
                    delete update[key]
                }
            })

            const updateManyOperation: any = {
                $set: update
            }
            if (includeAddToSet) {
                updateManyOperation.$addToSet = $addToSet
            }

            try {
                documents = await model.updateMany({ _id: { $in: ids } }, updateManyOperation).exec()
            }
            catch (retrievalError) {
                throw retrievalError
            }
        }
        else {
            try {
                documents = await model.updateMany({ _id: { $in: ids } }, { $set: update }).exec()
            }
            catch (retrievalError) {
                throw retrievalError
            }
        }

        return documents
    }

    /**
     * Update a document by `id`
     *
     * @param {mongoose.Model} model The Mongoose `Model` representing the collection containing the document
     * @param {ObjectId|string} id The document's `<ObjectId>_id` field
     * @param {object} update An object representing the fields to be updated
     * @param {boolean} concatArrays Set to `true` if fields containing arrays should be treated as additions to the existing array. Defaults to `false`, meaning that arrays are replaced in the same way as other fields
     * @memberof DbClient
     */
    public async updateById<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, id: string|Types.ObjectId, update: object, concatArrays = true): Promise<T> {
        const model = _model.__model
        let document: T

        function updateDoc(doc: T & Document, enumerable: object) {
            if (!enumerable || !Object.keys(enumerable) || !Object.keys(enumerable).length) {
                throw new SchemaError('Invalid update')
            }

            Object.keys(enumerable).forEach((key) => {
                if (concatArrays && Array.isArray(enumerable[key])) {
                    doc[key] = doc[key].concat(enumerable[key])
                }
                else {
                    doc[key] = enumerable[key]
                }
            })
        }

        try {
            document = await model.findById(id).exec()
        }
        catch (retrievalError) {
            throw retrievalError
        }

        try {
            updateDoc(document as T & Document, update)
        }
        catch (validationError) {
            throw validationError
        }

        try {
            const updatedDocumentResult = await document.save()
            const updatedDocument = updatedDocumentResult
            return updatedDocument
        }
        catch (updateError) {
            throw updateError
        }
    }

    /**
     * Create several documents using Model#create.
     *
     * @param {MongooseModel<T>} model
     * @param {T[]} docs
     * @returns {Promise<T[]>}
     * @memberof DbClient
     */
    public async create<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, docs: T[]): Promise<T[]> {
        const model = _model.__model
        try {
            const newDocs = await model.create(docs)

            if (!newDocs || !newDocs.length) {
                throw new Error(Copy.ErrorMessages.documentsNotCreated)
            }
            else {
                return newDocs
            }
        }
        catch (createError) {
            throw createError
        }
    }

    public delete<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, id: string): Promise<void> {
        const model = _model.__model
        return model.findByIdAndRemove(id).exec()
    }

    /**
     * Remove all documents matching the query.
     *
     * @param {MongooseModel<T>} model The Mongoose `Model` representing the collection containing the document
     * @param {string} query The 'find' query passed to `Model.remove`
     * @memberof DbClient
     */
    public remove<T extends MongooseDocument = RecordType>(_model: typeof MongooseDocument, query: object): Promise<T> {
        const model = _model.__model
        return model.remove(query).exec()
    }

    public async save<T extends MongooseDocument = RecordType>(document: T): Promise<T> {
console.log('\n\nattempt to save\n\n', document)
        try {
            const documentResult: T = await document.save()
console.log('\n\nsave result\n\n', documentResult)
            if (documentResult) {
                const savedDocument: T = documentResult
                return savedDocument
            }
            else {
                throw new Error('Document not saved.')
            }
        }
        catch (error) {
            throw error
        }
    }
}
