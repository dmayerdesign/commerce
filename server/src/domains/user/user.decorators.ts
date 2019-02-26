// import { ReflectMetadata, UseGuards } from '@nestjs/common'
// import { UserRole } from '@qb/common/constants/enums/user-role'
// import { ROLES_META } from './user.constants'
// import { UserGuard } from './user.guard'

// export function UserGuarded(...roles: UserRole[]) {
//   return function(target: object, key?: any, descriptor?: any) {
    // UseGuards(UserGuard)(target, key, descriptor)
    // if (roles.length) {
    //   ReflectMetadata(ROLES_META, roles)(target, key, descriptor)
    // }
//   }
// }

export function UserGuarded(...args: string[]) { return ((target, key, descriptor) => undefined) as ClassDecorator }
