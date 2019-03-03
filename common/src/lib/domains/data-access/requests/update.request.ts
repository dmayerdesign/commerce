import { ObjectId } from 'mongodb'
import { DeepPartial } from 'typeorm'

export class UpdateRequest<EntityType> {
  public id: ObjectId | string
  public update: DeepPartial<EntityType>

  constructor(request?: UpdateRequest<EntityType>) {
    if (request) {
      if (typeof request.id !== 'undefined') this.id = request.id
      if (typeof request.update !== 'undefined') this.update = request.update
    }
  }
}
