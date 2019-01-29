export interface UpdateRequest<EntityType> {
  id: any
  update: Partial<EntityType>
  unsafeArrayUpdates?: boolean
}
