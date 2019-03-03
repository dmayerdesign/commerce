import { ObjectId } from 'mongodb'
import { DeepPartial } from 'typeorm'

export class UpdateManyRequest<EntityType> {
  public ids: (string | ObjectId)[]
  public update: DeepPartial<EntityType>

  constructor(request?: UpdateManyRequest<EntityType>) {
    if (request) {
      if (typeof request.ids !== 'undefined') this.ids = request.ids
      if (typeof request.update !== 'undefined') this.update = request.update
    }
  }
}
