import { Entity } from '@qb/common/domains/data-access/entity.interface'
import { ObjectId } from 'mongodb'

export function getIdAsEntityType<EntityType extends Entity>(
  documentOrId: EntityType | ObjectId | string
): EntityType {
  if (typeof documentOrId === 'string' || !(documentOrId as any).id) {
    return documentOrId as any
  }
  // We want to avoid having to import `ObjectId` from typeorm, so we don't
  // have weird conflicts in our Angular TS compilation.
  return (documentOrId as any).id as any
    || documentOrId.toString()
}
