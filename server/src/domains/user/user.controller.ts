import { Controller, Delete, Get, Inject, Injectable, Param, Post, Put, Request,
  Response } from '@nestjs/common'
import { users } from '@qb/common/constants/api-endpoints'
import { Request as IRequest, Response as IResponse } from 'express'
import { UserController as UserControllerGenerated } from './user.controller.generated'
import { UserRepository } from './user.repository.generated'
import { UserService } from './user.service'

@Injectable()
@Controller(users)
export class UserController extends UserControllerGenerated {

    constructor(
        @Inject(UserRepository) protected readonly _repository: UserRepository,
        @Inject(UserService) private _userService: UserService,
    ) { super(_repository) }

    @Get()
    // @UseGuards(AuthGuard)
    public getUser(
        @Request() req: IRequest,
        @Response() res: IResponse,
    ): void {
        this._userService.refreshSession(req, res)
    }

    @Post('login')
    public login(
        @Request() req: IRequest,
        @Response() res: IResponse,
    ): void {
        this._userService.login(req.body, res)
            .catch(({message, status}) => res.status(status).json({message, status}))
    }

    @Post('verify-email/:token')
    public verifyEmail(
        @Param('token') token: string,
    ): void {
        this._userService.verifyEmail(token)
    }

    @Post('logout')
    public logout(
        @Response() res: IResponse,
    ): void {
        this._userService.logout(res)
    }

    @Post('register')
    public createUser(
        @Request() req: IRequest,
        @Response() res: IResponse,
    ): void {
        this._userService.register(req.body, res)
            .catch(({message, status}) => res.status(status).json({message, status}))
    }

    @Put('update')
    // @UseGuards(AuthGuard)
    public updateUser(
        @Request() { user, body }: any,
    ): void {
        this._userService.updateUser(user.id, body)
    }

    @Delete(':id')
    // @UseGuards(AdminGuard)
    public deleteUser(
        @Request() req: IRequest,
    ): void {
        this._userService.deleteUser(req.params.id)
    }
}
