import { Controller, Get, Inject, Param, Post, Request, Response } from '@nestjs/common'
import { User } from '@qb/common/api/entities/user'
import { users } from '@qb/common/constants/api-endpoints'
import { Request as IRequest, Response as IResponse } from 'express'
import { QbController } from '../../shared/controller/controller'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Controller(users)
export class UserController extends QbController<User> {
    constructor(
        @Inject(UserRepository) protected _repository: UserRepository,
        @Inject(UserService) private _userService: UserService,
    ) {
        super()
    }

    @Get()
    // @UseGuards(AuthGuard)
    public getUser(
        @Request() request: IRequest,
        @Response() response: IResponse,
    ): User {
        return this._userService.refreshSession(
            request,
            response,
        )
    }

    @Post('login')
    public login(
        @Request() request: IRequest,
        @Response() response: IResponse,
    ): Promise<User> {
        return this._userService.login(request.body, response)
    }

    @Post('verify-email/:token')
    public verifyEmail(
        @Param('token') token: string,
    ): Promise<void> {
        return this._userService.verifyEmail(token)
    }

    @Post('logout')
    public logout(
        @Response() response: IResponse,
    ): Promise<void> {
        return this._userService.logout(response)
    }

    @Post('register')
    public createUser(
        @Request() req: IRequest,
        @Response() res: IResponse,
    ): Promise<User> {
        return this._userService.register(req.body, res)
    }
}
