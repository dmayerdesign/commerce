import { HttpClient, HttpParams } from '@angular/common/http'
import { Crud } from '@qb/common/constants/crud'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request.interface'
import { UpdateManyRequest } from '@qb/common/domains/data-access/requests/update-many.request.interface'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request.interface'

export abstract class DataService<EntityType extends any> {
  public abstract readonly baseEndpoint: string
  protected abstract readonly _httpClient: HttpClient

  public get(id: string): Promise<EntityType> {
    return this._httpClient
      .get<EntityType>(`${this.baseEndpoint}/${id}`).toPromise()
  }

  public list(request: ListRequest<EntityType>): Promise<EntityType[]> {
    return this._httpClient
      .get<EntityType[]>(this.baseEndpoint, {
        params: new HttpParams().set(Crud.Params.listRequest, JSON.stringify(request))
      })
      .toPromise()
  }

  // TODO: Figure out streaming with TypeORM.
  // public stream(request: ListRequest<EntityType>): Promise<EntityType[]> {
  //   return this._httpClient
  //     .get<EntityType[]>(`${this.baseEndpoint}/stream`, {
  //       params: new HttpParams().set(Crud.Params.listRequest, JSON.stringify(request))
  //     })
  //     .toPromise()
  // }

  public create(body: EntityType[]): Promise<EntityType[]> {
    return this._httpClient
      .post<EntityType[]>(this.baseEndpoint, body)
      .toPromise()
  }

  public updateMany(request: UpdateManyRequest<EntityType>): Promise<EntityType[]> {
    return this._httpClient
      .put<EntityType[]>(this.baseEndpoint, request)
      .toPromise()
  }

  public update(request: UpdateRequest<EntityType>): Promise<EntityType> {
    return this._httpClient
      .put<EntityType>(`${this.baseEndpoint}/${request.id}`, request)
      .toPromise()
  }

  public delete(id: string): Promise<EntityType> {
    return this._httpClient
      .delete<EntityType>(`${this.baseEndpoint}/${id}`)
      .toPromise()
  }
}
