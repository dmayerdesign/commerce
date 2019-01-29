import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import { AuthConfig } from '@qb/common/config/auth-config'
import { Cookies } from '@qb/common/constants/cookies'
import { Copy } from '@qb/common/constants/copy'
import { HttpStatus } from '@qb/common/constants/http-status'
import { Login } from '@qb/common/domains/auth/login'
import { User } from '@qb/common/domains/user/user'
import { Wishlist } from '@qb/common/domains/wishlist/wishlist'
import { cleanUserForJwt } from '@qb/common/helpers/user.helpers'
import * as bcrypt from 'bcrypt-nodejs'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getIdAsEntityType } from 'server/src/shared/data-access/data-access.helpers'
import { WishlistRepository } from '../wishlist/wishlist.repository'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
    private _jwtSecret = process.env.JWT_SECRET

    constructor(
        @Inject(UserRepository) protected _userRepository: UserRepository,
        @Inject(WishlistRepository) protected _wishlistRepository: WishlistRepository,
    ) { }

    public async register(user: User, res: Response): Promise<User> {
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
                let savedUser = await this._userRepository.insert({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email.toLowerCase(),
                    password: hash,
                })

                // Create a wishlist for the user.

                const savedWishlist = await this._wishlistRepository.insert({
                    user: savedUser
                })

                savedUser = await this._userRepository.update(
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

                res.cookie(Cookies.jwt, authToken, AuthConfig.CookieOptions)
                return payload
            }
            else {
                throw new HttpException(
                    new Error(Copy.ErrorMessages.userEmailExists),
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
                    new Error(Copy.ErrorMessages.userNotFound),
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

                res.cookie(Cookies.jwt, authToken, AuthConfig.CookieOptions)
                return payload
            } else {
                throw new BadRequestException(
                    new Error(Copy.ErrorMessages.invalidPassword)
                )
            }
        }
        catch (error) {
            throw new BadRequestException(error)
        }
    }

    public async logout(res: Response): Promise<void> {
        res.clearCookie(Cookies.jwt)
    }

    public refreshSession(req: Request, res: Response): User {
        const payload = cleanUserForJwt((req as any).user)
        const authToken = jwt.sign(
            payload,
            this._jwtSecret as string,
            AuthConfig.JwtOptions
        )
        res.cookie(Cookies.jwt, authToken, AuthConfig.CookieOptions)
        return payload
    }

    public async verifyEmail(token: string): Promise<void> {
        try {
            const user = await this._userRepository.lookup(
                'emailVerificationToken', token
            )

            if (!user) {
                throw new HttpException(
                    new Error(
                        'User not found - the email verification token did not match ' +
                        'any token in the database'
                    ),
                    HttpStatus.CLIENT_ERROR_NOT_FOUND
                )
            }
            else {
                if (user.emailTokenExpires as number < Date.now()) {
                    throw new HttpException(new Error('Verification token has expired'), HttpStatus.CLIENT_ERROR_BAD_REQUEST)
                }
            }
        }
        catch (error) {
            throw new HttpException(error, HttpStatus.SERVER_ERROR_INTERNAL)
        }
    }
}
