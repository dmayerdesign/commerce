import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { DEVELOPER_TOKEN, JWT } from '@qb/common/constants/cookies'
import { UserRole } from '@qb/common/constants/enums/user-role'
import { User } from '@qb/common/domains/user/user'
import { cleanUser } from '@qb/common/helpers/user.helpers'
import { RequestWithUser } from '@qb/common/models/server/request-with-user'
import { environment } from '@qb/environment-vars'
import * as jwt from 'jsonwebtoken'
import { UserRepository } from './user.repository'

const jwtSecret = environment().JWT_SECRET
const developerToken = environment().DEVELOPER_TOKEN

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _userRepository: UserRepository,
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this._reflector.get<UserRole[]>('roles', context.getClass())
      const request = context.switchToHttp().getRequest<RequestWithUser>()

      if (!roles) {
        return this._isAuthenticated(request)
      } else {
        return this._hasRole(request, roles)
      }
    } catch (_error) {
      return false
    }
  }

  private async _isAuthenticated(request: RequestWithUser): Promise<boolean> {
    const developerTokenCookie = request.cookies[DEVELOPER_TOKEN]
    const token = request.cookies[JWT]
    let payload: User | undefined

    if (
      developerTokenCookie &&
      developerTokenCookie === developerToken
    ) {
      return true
    }

    if (!token) {
      return false
    }
    else {
      try {
        payload = jwt.verify(token, jwtSecret as string) as User
      }
      catch (error) {
        return false
      }

      if (!!payload) {
        if (payload.email) {
          request.user = cleanUser(payload)
          return true
        }

        const user = await this._userRepository.get(payload.id)

        if (user) {
          request.user = user
          return true
        } else {
          return false
        }
      }
    }

    return false
  }

  private async _hasRole(
    request: RequestWithUser,
    roles: UserRole[],
  ): Promise<boolean> {
    const { user } = request
    const isAuthenticated = await this._isAuthenticated(request)
    return isAuthenticated
      && user
      && !!user.role
      && roles.some((role) => user.role === role)
  }
}
