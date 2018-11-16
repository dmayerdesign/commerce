import { Document } from '@qb/common/goosetype/interfaces'

export interface Login extends Document {
    email: string
    password: string
}
