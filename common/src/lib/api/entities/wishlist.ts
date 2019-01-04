import { arrayProp, model, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { Product } from './product'

@model(MongooseSchemaOptions.timestamped)
export class Wishlist {
    @ObjectIdColumn() public id: ObjectID
    @Column() public userId: string
    @OneToMany({ ref: Product }) public products: Ref<Product>[]
}
