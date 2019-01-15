import { Inject, Injectable } from '@nestjs/common'
import { User } from '@qb/common/api/entities/user'
import { Wishlist } from '@qb/common/api/entities/wishlist'
import { Login } from '@qb/common/api/interfaces/login'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { ApiErrorResponse } from '@qb/common/api/responses/api-error.response'
import { ApiResponse } from '@qb/common/api/responses/api.response'
import { AuthConfig } from '@qb/common/config/auth-config'
import { Cookies } from '@qb/common/constants/cookies'
import { Copy } from '@qb/common/constants/copy'
import { HttpStatus } from '@qb/common/constants/http-status'
import { cleanUserForJwt } from '@qb/common/helpers/user.helpers'
import * as bcrypt from 'bcrypt-nodejs'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getIdAsEntityType } from 'server/src/shared/data-access/data-access.helpers'
import { ObjectID } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class UserService {
    private _jwtSecret = process.env.JWT_SECRET
    protected model = User

    constructor(
        @Inject(QbRepository) protected _userRepository: QbRepository<User>,
        @Inject(QbRepository) protected _wishlistRepository: QbRepository<Wishlist>
    ) { }

    public async register(user: User, res: Response): Promise<void> {
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
            throw new ApiErrorResponse(error, HttpStatus.CLIENT_ERROR_BAD_REQUEST)
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
                        update: { wishlist: getIdAsEntityType<Wishlist>(savedWishlist.id) }
                    })
                )

                // Create the JWT token and the JWT cookie.

                const payload = cleanUserForJwt(savedUser)
                const authToken = jwt.sign(payload, this._jwtSecret as string, AuthConfig.JwtOptions)

                res.cookie(Cookies.jwt, authToken, AuthConfig.CookieOptions).json(payload)
                return
            }
            else {
                throw new ApiErrorResponse(
                    new Error(Copy.ErrorMessages.userEmailExists),
                    HttpStatus.CLIENT_ERROR_BAD_REQUEST,
                )
            }
        }
        catch (error) {
            throw new ApiErrorResponse(error, HttpStatus.CLIENT_ERROR_BAD_REQUEST)
        }
    }

    public async login(credentials: Login, res: Response): Promise<void> {
        try {

            // Find a user with the provided email.

            const user = await this._userRepository.lookup(
                'email', credentials.email.toLowerCase()
            )

            // If no user is found, send a 404.

            if (!user) {
                throw new ApiErrorResponse(
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

                res.cookie(Cookies.jwt, authToken, AuthConfig.CookieOptions).json(payload)
                return
            } else {
                throw new ApiErrorResponse(
                    new Error(Copy.ErrorMessages.invalidPassword),
                    HttpStatus.CLIENT_ERROR_UNAUTHORIZED
                )
            }
        }
        catch (error) {
            throw new ApiErrorResponse(error, HttpStatus.CLIENT_ERROR_BAD_REQUEST)
        }
    }

    public logout(res: Response): void {
        res.clearCookie(Cookies.jwt).json({})
    }

    public refreshSession(req: Request, res: Response): void {
        const payload = cleanUserForJwt((req as any).user)
        const authToken = jwt.sign(
            payload,
            this._jwtSecret as string,
            AuthConfig.JwtOptions
        )
        res.cookie(Cookies.jwt, authToken, AuthConfig.CookieOptions)
        res.json(payload)
    }

    public async updateUser(id: ObjectID, update: Partial<User>): Promise<User> {
        return this._userRepository.update(
            new UpdateRequest<User>({ id, update })
        )
    }

    public async deleteUser(id: ObjectID): Promise<ApiResponse<null>> {
        try {
            await this._userRepository.delete(id)
            return new ApiResponse(null, HttpStatus.SUCCESS_NO_CONTENT)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async verifyEmail(token: string): Promise<ApiResponse<User>> {
        try {
            const user = await this._userRepository.lookup(
                'emailVerificationToken', token
            )

            if (!user) {
                throw new ApiErrorResponse(
                    new Error('User not found - the email verification token did not match any token in the database'),
                    HttpStatus.CLIENT_ERROR_NOT_FOUND
                )
            }
            else {
                if (user.emailTokenExpires as number < Date.now()) {
                    throw new ApiErrorResponse(new Error('Verification token has expired'), HttpStatus.CLIENT_ERROR_BAD_REQUEST)
                }
                else {
                    return new ApiResponse(user)
                }
            }
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }
}
