import { DeepPartial, ObjectID } from 'typeorm'

export class UpdateRequest<EntityType> {
  public id: ObjectID
  public update: DeepPartial<EntityType>
  public unsafeArrayUpdates?: boolean

  constructor(request?: UpdateRequest<EntityType>) {
    if (request) {
      if (typeof request.id !== 'undefined') this.id = request.id
      if (typeof request.update !== 'undefined') this.update = request.update
      if (typeof request.unsafeArrayUpdates !== 'undefined') this.unsafeArrayUpdates = request.unsafeArrayUpdates
    }
  }
}
