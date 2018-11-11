import { Controller, Delete, Get, Inject, Post, Put, Request, Response } from '@nestjs/common'
import { DomainEvent } from '@qb/common/api/entities/domain-event'
import { DbClient, DB_CLIENT } from '@qb/common/api/interfaces/db-client'
import { Request as IRequest, Response as IResponse } from 'express'
import { Document } from 'mongoose'

export abstract class QbController<EntityType extends Document> {

  protected abstract _dbClient: DbClient<EntityType>

  @Get('/')
  public list(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ): Promise<EntityType[]> {
    return this._dbClient.list(request, response)
  }

  @Get('/:id')
  public get(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ): Promise<EntityType> {
    return this._dbClient.get(request, response)
  }

  @Post('/')
  public create(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ): Promise<EntityType[]> {
    return this._dbClient.create(request, response)
  }

  @Put('/')
  public updateMany(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ): Promise<EntityType[]> {
    return this._dbClient.updateMany(request, response)
  }

  @Put('/:id')
  public update(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ): Promise<EntityType> {
    return this._dbClient.update(request, response)
  }

  @Delete('/')
  public deleteMany(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ): Promise<EntityType[]> {
    return this._dbClient.deleteMany(request, response)
  }

  @Delete('/:id')
  public delete(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ): Promise<EntityType> {
    return this._dbClient.delete(request, response)
  }
}

@Controller('api/domain-events')
export class DomainEventController extends QbController<any> {
  constructor(
    @Inject(DB_CLIENT) protected readonly _dbClient: DbClient<any>
  ) {
    super()
    this._dbClient.configureForGoosetypeEntity(DomainEvent)
  }

  @Get('/')
  public async list(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ): Promise<DomainEvent[]> {
    await this._dbClient.create({body: [{}]} as IRequest, response)
    return this._dbClient.list(request, response)
  }
}
