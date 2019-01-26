import { User } from '@qb/common/api/interfaces/user'
import { Request } from 'express'

export interface RequestWithUser extends Request {
  user: User
}
