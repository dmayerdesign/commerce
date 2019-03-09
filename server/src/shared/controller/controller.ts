import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { Params } from '@qb/common/constants/crud'
import { Entity } from '@qb/common/domains/data-access/entity.interface'
import { BaseRepository, ReadOnlyRepository, Repository } from '@qb/common/domains/data-access/repository.interface'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { UpdateManyRequest } from '@qb/common/domains/data-access/requests/update-many.request'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import { DeleteWriteOpResultObject, InsertWriteOpResult, UpdateWriteOpResult } from 'mongodb'

export abstract class BaseController<EntityType extends any> {

  protected abstract _repository: BaseRepository<EntityType>

  @Get(':id')
  public get(
    @Param('id') id: string,
  ): Promise<EntityType | undefined> {
    return this._repository.get(id)
  }

  @Get()
  public list(
    @Query(Params.LIST_REQUEST) query: string,
  ): Promise<EntityType[]> {
    const request: ListRequest<EntityType> = query ? JSON.parse(query) : new ListRequest()
    return this._repository.list(request)
  }

  // TODO: Figure out streaming with TypeORM.
  // @Get('stream')
  // public stream(
  //   @Query(Params.LIST_REQUEST) query: string,
  //   @Response() response: IResponse,
  // ): Promise<void> {
  //   const request: ListRequest<EntityType> = query ? JSON.parse(query) : new ListRequest()
  //   return this._repository.stream(request, response)
  // }

  @Post()
  public insertMany(
    @Body() body: EntityType[],
  ): Promise<InsertWriteOpResult> {
    return this._repository.insertMany(body)
  }

  @Put()
  public updateMany(
    @Body() body: UpdateManyRequest<EntityType>,
  ): Promise<UpdateWriteOpResult> {
    return this._repository.updateMany(body)
  }

  @Put(':id')
  public update(
    @Body() body: UpdateRequest<EntityType>,
  ): Promise<UpdateWriteOpResult> {
    return this._repository.update(body)
  }

  @Delete()
  public deleteMany(
    @Body() { ids }: { ids: string[] },
  ): Promise<DeleteWriteOpResultObject> {
    return this._repository.deleteMany(ids)
  }

  @Delete(':id')
  public delete(
    @Param('id') id: string,
  ): Promise<DeleteWriteOpResultObject> {
    return this._repository.delete(id)
  }
}

export abstract class ReadOnlyController<EntityType extends any> {

  protected abstract _repository: ReadOnlyRepository<EntityType>

  @Get()
  public list(
    @Query(Params.LIST_REQUEST) query: string,
  ): Promise<EntityType[]> {
    const request: ListRequest<EntityType> = query ? JSON.parse(query) : new ListRequest()
    return this._repository.list(request)
  }

  @Get(':id')
  public async get?(
    @Param('id') id: string,
  ): Promise<EntityType | undefined> {
    return !!this._repository.get ? this._repository.get(id) : undefined
  }
}

export abstract class ThirdPartyController<EntityType extends any>
    extends BaseController<EntityType> { }

export abstract class Controller<EntityType extends Entity>
    extends BaseController<EntityType> {
  protected abstract _repository: Repository<EntityType>
}

