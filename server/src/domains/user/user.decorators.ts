import { ReflectMetadata, UseGuards } from '@nestjs/common'
import { UserRole } from '@qb/common/constants/enums/user-role'
import { ROLES_META } from './user.constants'
import { UserGuard } from './user.guard'

export const Authenticated = (...roles: UserRole[]) =>
  (target: object, key?: any, descriptor?: any) => {
    UseGuards(UserGuard)(target, key, descriptor)
    ReflectMetadata(ROLES_META, roles)(target, key, descriptor)
  }
