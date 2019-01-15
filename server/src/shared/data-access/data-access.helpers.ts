import { Entity } from '@qb/common/api/interfaces/entity'
import { ObjectID } from 'typeorm'

export function getIdAsEntityType<EntityType extends Entity>(
  documentOrId: EntityType | ObjectID | string
): EntityType {
  if (typeof documentOrId === 'string' || !(documentOrId as any).id) {
    return documentOrId as any
  }
  // We want to avoid having to import `ObjectID` from typeorm, so we don't
  // have weird conflicts in our Angular TS compilation.
  return (documentOrId as any).id as any
    || documentOrId.toString()
}
