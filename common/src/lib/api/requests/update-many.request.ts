export class UpdateManyRequest<EntityType> {
  public ids: string[]
  public update: Partial<EntityType>
  public unsafeArrayUpdates?: boolean

  constructor(request?: UpdateManyRequest<EntityType>) {
    if (request) {
      if (typeof request.ids !== 'undefined') this.ids = request.ids
      if (typeof request.update !== 'undefined') this.update = request.update
      if (typeof request.unsafeArrayUpdates !== 'undefined') this.unsafeArrayUpdates = request.unsafeArrayUpdates
    }
  }
}
