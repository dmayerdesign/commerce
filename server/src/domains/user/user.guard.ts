import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from '@qb/common/api/entities/user'
import { Cookies } from '@qb/common/constants/cookies'
import { Copy } from '@qb/common/constants/copy'
import { UserRole } from '@qb/common/constants/enums/user-role'
import { HttpStatus } from '@qb/common/constants/http-status'
import { cleanUser } from '@qb/common/helpers/user.helpers'
import { RequestWithUser } from '@qb/common/models/server/request-with-user'
import * as jwt from 'jsonwebtoken'
import { UserRepository } from './user.repository'
const jwtSecret = process.env.JWT_SECRET

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _userRepository: UserRepository,
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this._reflector.get<UserRole[]>('roles', context.getClass())
    const { getRequest } = context.switchToHttp()
    const request = getRequest<RequestWithUser>()

    if (!roles) {
      return this._isAuthenticated(request)
    } else {
      return this._hasRole(request, roles)
    }
  }

  private async _isAuthenticated(request: RequestWithUser): Promise<boolean> {
    const token = request.cookies[Cookies.jwt]
    let payload: User | undefined

    if (!token) {
      throw new HttpException(
        new Error(Copy.ErrorMessages.userNotAuthenticated),
        HttpStatus.CLIENT_ERROR_UNAUTHORIZED
      )
    }
    else {
      try {
        payload = jwt.verify(token, jwtSecret as string) as User
      }
      catch (error) {
        throw new HttpException(
          new Error(Copy.ErrorMessages.userNotAuthenticated),
          HttpStatus.CLIENT_ERROR_UNAUTHORIZED,
        )
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
