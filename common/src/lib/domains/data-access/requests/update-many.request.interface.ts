export interface UpdateManyRequest<EntityType> {
  ids: any[]
  update: Partial<EntityType>
  unsafeArrayUpdates?: boolean
}
