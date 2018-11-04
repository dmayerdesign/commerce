import { prop, schema, MongooseDocument } from '../../goosetype'

@schema(Dimensions)
export class Dimensions extends MongooseDocument {
    @prop() public length: number
    @prop() public width: number
    @prop() public height: number
}
