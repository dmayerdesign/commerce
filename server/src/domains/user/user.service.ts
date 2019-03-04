import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common'
import { AuthConfig } from '@qb/common/config/auth-config'
import { JWT } from '@qb/common/constants/cookies'
import { ErrorMessages } from '@qb/common/constants/copy'
import { HttpStatus } from '@qb/common/constants/http-status'
import { Login } from '@qb/common/domains/auth/login'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import { User } from '@qb/common/domains/user/user'
import { Wishlist } from '@qb/common/domains/wishlist/wishlist'
import { cleanUserForJwt } from '@qb/common/helpers/user.helpers'
import { environment } from '@qb/environment-vars'
import * as bcrypt from 'bcrypt-nodejs'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getIdAsEntityType } from 'server/src/shared/data-access/data-access.helpers'
import { WishlistRepository } from '../wishlist/wishlist.repository'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  private _jwtSecret = environment().JWT_SECRET

  constructor(
    @Inject(UserRepository) protected _userRepository: UserRepository,
    @Inject(WishlistRepository) protected _wishlistRepository: WishlistRepository,
  ) { }

  public async register(user: User, res: Response, isDevUser = false): Promise<User> {
    const plainTextPassword = user.password as string
    let salt: string
    let hash: string
    delete user.password

    // Hash the password.

    try {
      salt = bcrypt.genSaltSync(12)
      hash = bcrypt.hashSync(plainTextPassword, salt)
    }
    catch (error) {
      throw new HttpException(error, HttpStatus.CLIENT_ERROR_BAD_REQUEST)
    }

    try {

      // Check for an existing user.

      const existingUser = await this._userRepository.lookup(
        'email', user.email.toLowerCase()
      )

      // If there's no existing user, create a new one.

      if (!existingUser) {
        let savedUser = await this._userRepository.insertAndGet({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email.toLowerCase(),
          password: hash,
        })

        // Create a wishlist for the user.

        const savedWishlist = await this._wishlistRepository.insertAndGet({
          user: savedUser
        })

        savedUser = await this._userRepository.updateAndGet(
          new UpdateRequest<User>({
            id: savedUser.id,
            update: {
              wishlist: getIdAsEntityType<Wishlist>(savedWishlist.id)
            }
          })
        )

        // Create the JWT token and the JWT cookie.

        const payload = cleanUserForJwt(savedUser)
        const authToken = jwt.sign(
          payload,
          this._jwtSecret as string,
          AuthConfig.JwtOptions
        )

        res.cookie(JWT, authToken, AuthConfig.CookieOptions)
        return payload
      }
      else {
        throw new HttpException(
          ErrorMessages.USER_EMAIL_EXISTS,
          HttpStatus.CLIENT_ERROR_BAD_REQUEST,
        )
      }
    }
    catch (error) {
      throw new HttpException(error, HttpStatus.CLIENT_ERROR_BAD_REQUEST)
    }
  }

  public async login(credentials: Login, res: Response): Promise<User> {
    try {

      // Find a user with the provided email.

      const user = await this._userRepository.lookup(
        'email', credentials.email.toLowerCase()
      )

      // If no user is found, send a 404.

      if (!user) {
        throw new HttpException(
          ErrorMessages.USER_NOT_FOUND,
          HttpStatus.CLIENT_ERROR_NOT_FOUND
        )
      }

      // If a user is found, authenticate their password.

      const authenticated: boolean = bcrypt.compareSync(
        credentials.password,
        user.password as string
      )

      if (authenticated) {
        const payload = cleanUserForJwt(user)
        const authToken = jwt.sign(
          payload,
          this._jwtSecret as string,
          AuthConfig.JwtOptions
        )

        res.cookie(JWT, authToken, AuthConfig.CookieOptions)
        return payload
      } else {
        throw new BadRequestException(ErrorMessages.INVALID_PASSWORD)
      }
    }
    catch (error) {
      throw new BadRequestException(error.message, error)
    }
  }

  public async logout(res: Response): Promise<void> {
    res.clearCookie(JWT)
  }

  public refreshSession(req: Request, res: Response): User {
    const payload = cleanUserForJwt((req as any).user)
    const authToken = jwt.sign(
      payload,
      this._jwtSecret as string,
      AuthConfig.JwtOptions
    )
    res.cookie(JWT, authToken, AuthConfig.CookieOptions)
    return payload
  }

  public async verifyEmail(token: string): Promise<void> {
    const user = await this._userRepository.lookup(
      'emailVerificationToken', token
    )

    if (!user) {
      throw new HttpException(
        'User not found - the email verification token did not match ' +
        'any token in the database',
        HttpStatus.CLIENT_ERROR_NOT_FOUND
      )
    }
    else {
      if (user.emailTokenExpires as number < Date.now()) {
        throw new HttpException(
          'Verification token has expired',
          HttpStatus.CLIENT_ERROR_BAD_REQUEST,
        )
      }
    }
  }
}
