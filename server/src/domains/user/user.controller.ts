import { Controller, Delete, Get, Inject, Param, Post, Put,
  Request, Response} from '@nestjs/common'
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
