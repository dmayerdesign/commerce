import { User } from '@qb/common/domains/user/user.interface'
import { Request } from 'express'

export interface RequestWithUser extends Request {
  user: User
}
