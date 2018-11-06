import * as bcrypt from 'bcrypt-nodejs'
import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import * as jwt from 'jsonwebtoken'

import { User } from '@mte/common/api/entities/user'
import { Wishlist } from '@mte/common/api/entities/wishlist'
import { Login } from '@mte/common/api/interfaces/login'
import { PopulateOptions } from '@mte/common/api/interfaces/populate-options'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { ApiResponse } from '@mte/common/api/responses/api.response'
import { AuthConfig } from '@mte/common/config/auth.config'
import { Cookies, Copy, HttpStatus } from '@mte/common/constants'
import { Types } from '@mte/common/constants/inversify/types'
import { UserHelper } from '@mte/common/helpers/user.helper'
import { DbClient } from '../data-access/db-client'
import { CrudService } from './crud.service'

@injectable()
export class UserService extends CrudService<User> {
    private _jwtSecret = process.env.JWT_SECRET
    protected model = User

    constructor(
        @inject(Types.DbClient) protected dbClient: DbClient<User>
    ) { super() }

    private userPopulateOptions: PopulateOptions = {
        path: 'wishlist',
        model: Wishlist.getModel(),
    }

    public async register(user: User, res: Response): Promise<void> {
        const plainTextPassword = user.password
        let salt, hash
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

            const existingUser = await this.dbClient.findOne(User, { email: user.email.toLowerCase() }, [ this.userPopulateOptions ])

            // If there's no existing user, create a new one.

            if (!existingUser) {
                const newUser = new User({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email.toLowerCase(),
                    password: hash,
                })

                let savedUser = await this.dbClient.save(newUser)

                // Create a wishlist for the user.

                const newWishlist = new Wishlist({
                    user: savedUser._id
                })
                const savedWishlist = await this.dbClient.save(newWishlist)
                savedUser.wishlist = savedWishlist._id
                savedUser = await this.dbClient.save(savedUser)

                // Create the JWT token and the JWT cookie.

                const payload = UserHelper.cleanUserForJwt(savedUser)
                const authToken = jwt.sign(payload, this._jwtSecret, AuthConfig.JwtOptions)

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

            const user = await this.dbClient.findOne(User, {
                email: credentials.email.toLowerCase()
            }, [ this.userPopulateOptions ])

            // If no user is found, send a 404.

            if (!user) {
                throw new ApiErrorResponse(
                    new Error(Copy.ErrorMessages.userNotFound),
                    HttpStatus.CLIENT_ERROR_NOT_FOUND
                )
            }

            // If a user is found, authenticate their password.

            const authenticated: boolean = bcrypt.compareSync(credentials.password, user.password)
            if (authenticated) {
                const payload = UserHelper.cleanUserForJwt(user)
                const authToken = jwt.sign(payload, this._jwtSecret, AuthConfig.JwtOptions)

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
        const payload = UserHelper.cleanUserForJwt((req as any).user)
        const authToken = jwt.sign(payload, this._jwtSecret, AuthConfig.JwtOptions)
        res.cookie(Cookies.jwt, authToken, AuthConfig.CookieOptions)
        res.json(payload)
    }

    public async updateUser(id: string, update: any): Promise<ApiResponse<User>> {
        try {
            const { _doc } = await this.dbClient.updateById(User, id, update)
            const user = _doc
            return new ApiResponse(user)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async deleteUser(id: string): Promise<ApiResponse<null>> {
        try {
            await this.dbClient.delete(User, id)
            return new ApiResponse(null, HttpStatus.SUCCESS_NO_CONTENT)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async verifyEmail(token: string): Promise<ApiResponse<User>> {
        try {
            const user = await this.dbClient.findOne(User, { emailVerificationToken: token }, [ this.userPopulateOptions ])

            if (!user) {
                throw new ApiErrorResponse(
                    new Error('User not found - the email verification token did not match any token in the database'),
                    HttpStatus.CLIENT_ERROR_NOT_FOUND
                )
            }
            else {
                if (user.emailTokenExpires < Date.now()) {
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
