import { Error as MongooseError } from 'mongoose'

export class InternalServerError extends Error { }
export class SchemaError extends MongooseError { }
export class RegistrationError extends Error { }
