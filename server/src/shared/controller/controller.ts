import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { Entity } from '@qb/common/api/interfaces/entity'
import { QbBaseRepository, QbReadOnlyRepository, QbRepository } from '@qb/common/api/interfaces/repository'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { UpdateManyRequest } from '@qb/common/api/requests/update-many.request'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { Crud } from '@qb/common/constants/crud'

export abstract class QbBaseController<EntityType extends any> {

  protected abstract _repository: QbBaseRepository<EntityType>

  @Get(':id')
  public get(
    @Param('id') id: string,
  ): Promise<EntityType | undefined> {
    return this._repository.get(id)
  }

  @Get()
  public list(
    @Query(Crud.Params.listRequest) query: string,
  ): Promise<EntityType[]> {
    const request: ListRequest<EntityType> = query ? JSON.parse(query) : new ListRequest()
    return this._repository.list(request)
  }

  // TODO: Figure out streaming with TypeORM.
  // @Get('stream')
  // public stream(
  //   @Query(Crud.Params.listRequest) query: string,
  //   @Response() response: IResponse,
  // ): Promise<void> {
  //   const request: ListRequest<EntityType> = query ? JSON.parse(query) : new ListRequest()
  //   return this._repository.stream(request, response)
  // }

  @Post()
  public insertMany(
    @Body() body: EntityType[],
  ): Promise<EntityType[]> {
    return this._repository.insertMany(body)
  }

  @Put()
  public updateMany(
    @Body() body: UpdateManyRequest<EntityType>,
  ): Promise<EntityType[]> {
    return this._repository.updateMany(body)
  }

  @Put(':id')
  public update(
    @Body() body: UpdateRequest<EntityType>,
  ): Promise<EntityType> {
    return this._repository.update(body)
  }

  @Delete()
  public deleteMany(
    @Body() { ids }: { ids: string[] },
  ): Promise<EntityType[]> {
    return this._repository.deleteMany(ids)
  }

  @Delete(':id')
  public delete(
    @Param('id') id: string,
  ): Promise<EntityType> {
    return this._repository.delete(id)
  }
}

export abstract class QbReadOnlyController<EntityType extends any> {

  protected abstract _repository: QbReadOnlyRepository<EntityType>

  @Get()
  public list(
    @Query(Crud.Params.listRequest) query: string,
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

export abstract class QbThirdPartyController<EntityType extends any>
  extends QbBaseController<EntityType> { }

export abstract class QbController<EntityType extends Entity>
  extends QbBaseController<EntityType> {
  protected abstract _repository: QbRepository<EntityType>
}

