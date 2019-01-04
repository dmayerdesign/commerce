// import { Request, Response } from 'express'
// import { Inject, Injectable } from '@nestjs/common'
// import {
//     controller,
//     httpDelete,
//     httpGet,
//     httpPost,
//     httpPut,
//     request,
//     requestParam,
//     response,
// } from 'inversify-express-utils'

// import { ApiEndpoints } from '@qb/common/constants/api-endpoints'
// import { Types } from '@qb/common/constants/inversify/types'
// import { UserService } from '../services/user.service'
// import { QbController } from '../../../shared/controller/controller'

// @injectable()
// @controller(User)
// export class UserController extends QbController {

//     constructor(
//         @Inject(UserService) private _userService: UserService,
//     ) { super() }

//     @httpGet('/', Types.isAuthenticated)
//     public getUser(
//         @request() req: Request,
//         @response() res: Response,
//     ): void {
//         this._userService.refreshSession(req, res)
//     }

//     @httpPost('/login')
//     public login(
//         @request() req: Request,
//         @response() res: Response,
//     ): void {
//         this._userService.login(req.body, res)
//             .catch(({message, status}) => res.status(status).json({message, status}))
//     }

//     @httpPost('/verify-email/:token')
//     public verifyEmail(
//         @requestParam('token') token: string,
//         @response() res: Response,
//     ): void {
//         this.handleApiResponse(this._userService.verifyEmail(token), res)
//     }

//     @httpPost('/logout')
//     public logout(
//         @response() res: Response,
//     ): void {
//         this._userService.logout(res)
//     }

//     @httpPost('/register')
//     public createUser(
//         @request() req: Request,
//         @response() res: Response,
//     ): void {
//         this._userService.register(req.body, res)
//             .catch(({message, status}) => res.status(status).json({message, status}))
//     }

//     @httpPut('/update', Types.isAuthenticated)
//     public updateUser(
//         @request() req: Request,
//         @response() res: Response,
//     ): void {
//         this.handleApiResponse(this._userService.updateUser(req.user.id, req.body), res)
//     }

//     @httpDelete('/:id', Types.isOwner)
//     public deleteUser(
//         @request() req: Request,
//         @response() res: Response,
//     ): void {
//         this.handleApiResponse(this._userService.deleteUser(req.params.id), res)
//     }
// }
