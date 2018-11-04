import { DocumentToObjectOptions, ModelPopulateOptions, ModelUpdateOptions, NativeError, Query, SaveOptions, Schema, ValidationError } from 'mongoose'
import 'reflect-metadata'
import { MongooseModel } from './mongoose-model'

// Base classes

export abstract class MongooseDocument {
    // Goosetype.
    public static __model?: MongooseModel<any>
    public static __schema?: Schema

    public _doc?: this
    /** Hash containing current validation errors. */
    public errors?: Object
    /** This document's _id. */
    public _id?: any
    public id?: any
    /** Boolean flag specifying if the document is new. */
    public isNew?: boolean
    /** The document's schema. */
    public schema?: Schema
    public createdAt?: any
    public updatedAt?: any

    // Goosetype.
    constructor(doc: any = {}) {
        if ((this.constructor as typeof MongooseDocument).__model) {
            return new (this.constructor as typeof MongooseDocument).__model(doc)
        } else {
            return this
        }
    }
    public static getModel?(): MongooseModel<any> {
        return this.__model
    }

    /** Checks if a path is set to its default. */
    public $isDefault?(path?: string): boolean

    /**
     * Takes a populated field and returns it to its unpopulated state.
     * If the path was not populated, this is a no-op.
     */
    public depopulate?(path: string)

    /**
     * Returns true if the Document stores the same data as doc.
     * Documents are considered equal when they have matching _ids, unless neither document
     * has an _id, in which case this function falls back to usin deepEqual().
     * @param doc a document to compare
     */
    public equals?(doc: MongooseDocument): boolean

    /**
     * Explicitly executes population and returns a promise.
     * Useful for ES2015 integration.
     * @returns promise that resolves to the document when population is done
     */
    public execPopulate?(): Promise<this>

    /**
     * Returns the value of a path.
     * @param type optionally specify a type for on-the-fly attributes
     */
    public get?(path: string, type?: any): any

    /**
     * Initializes the document without setters or marking anything modified.
     * Called internally after a document is returned from mongodb.
     * @param doc document returned by mongo
     * @param fn callback
     */
    public init?(doc: MongooseDocument, fn?: () => void): this { return this }
    // public init?(doc: MongooseDocument, opts: Object, fn?: () => void): this { return this }

    /** Helper for console.log */
    public inspect?(options?: Object): any

    /**
     * Marks a path as invalid, causing validation to fail.
     * The errorMsg argument will become the message of the ValidationError.
     * The value argument (if passed) will be available through the ValidationError.value property.
     * @param path the field to invalidate
     * @param errorMsg the error which states the reason path was invalid
     * @param value optional invalid value
     * @param kind optional kind property for the error
     * @returns the current ValidationError, with all currently invalidated paths
     */
    public invalidate?(path: string, errorMsg: string | NativeError, value: any, kind?: string): ValidationError | boolean

    /** Returns true if path was directly set and modified, else false. */
    public isDirectModified?(path: string): boolean

    /** Checks if path was initialized */
    public isInit?(path: string): boolean

    /**
     * Returns true if this document was modified, else false.
     * If path is given, checks if a path or any full path containing path as part of its path
     * chain has been modified.
     */
    public isModified?(path?: string): boolean

    /** Checks if path was selected in the source query which initialized this document. */
    public isSelected?(path: string): boolean

    /**
     * Marks the path as having pending changes to write to the db.
     * Very helpful when using Mixed types.
     * @param path the path to mark modified
     */
    public markModified?(path: string)

    /** Returns the list of paths that have been modified. */
    public modifiedPaths?(): string[]

    /**
     * Populates document references, executing the callback when complete.
     * If you want to use promises instead, use this function with
     * execPopulate()
     * Population does not occur unless a callback is passed or you explicitly
     * call execPopulate(). Passing the same path a second time will overwrite
     * the previous path options. See Model.populate() for explaination of options.
     * @param path The path to populate or an options object
     * @param names The properties to fetch from the populated document
     * @param callback When passed, population is invoked
     */
    public populate?(callback: (err: any, res: this) => void): this
    public populate?(path: string, callback?: (err: any, res: this) => void): this
    public populate?(path: string, names: string, callback?: (err: any, res: this) => void): this
    public populate?(options: ModelPopulateOptions | ModelPopulateOptions[], callback?: (err: any, res: this) => void): this

    /** Gets _id(s) used during population of the given path. If the path was not populated, undefined is returned. */
    public populated?(path: string): any

    /**
     * Sets the value of a path, or many paths.
     * @param path path or object of key/vals to set
     * @param val the value to set
     * @param type optionally specify a type for "on-the-fly" attributes
     * @param options optionally specify options that modify the behavior of the set
     */
    public set?(path: string, val: any, options?: Object): this
    public set?(path: string, val: any, type: any, options?: Object): this
    public set?(value: Object): this

    /**
     * The return value of this method is used in calls to JSON.stringify(doc).
     * This method accepts the same options as Document#toObject. To apply the
     * options to every document of your schema by default, set your schemas
     * toJSON option to the same argument.
     */
    public toJSON?(options?: DocumentToObjectOptions): Object

    /**
     * Converts this document into a plain javascript object, ready for storage in MongoDB.
     * Buffers are converted to instances of mongodb.Binary for proper storage.
     */
    public toObject?(options?: DocumentToObjectOptions): Object

    /**
     * Clears the modified state on the specified path.
     * @param path the path to unmark modified
     */
    public unmarkModified?(path: string)

    /** Sends an update command with this document _id as the query selector.  */
    public update?(doc: this, callback?: (err: any, raw: any) => void): Query<any>
    public update?(doc: this, options: ModelUpdateOptions, callback?: (err: any, raw: any) => void): Query<any>

    /**
     * Executes registered validation rules for this document.
     * @param optional options internal options
     * @param callback callback called after validation completes, passing an error if one occurred
     */
    public validate?(callback?: (err: any) => void): Promise<void>
    public validate?(optional: Object, callback?: (err: any) => void): Promise<void>

    /**
     * Executes registered validation rules (skipping asynchronous validators) for this document.
     * This method is useful if you need synchronous validation.
     * @param pathsToValidate only validate the given paths
     * @returns MongooseError if there are errors during validation, or undefined if there is no error.
     */
    public validateSync?(pathsToValidate?: string | string[]): Error

    public save?(...args: any[]): Promise<this> & void
    public save?(optionsOrCb?: (SaveOptions | ((err: any, product: this) => void)), cbOrOptions?: (SaveOptions | ((err: any, product: this) => void))): Promise<this> | void
}

