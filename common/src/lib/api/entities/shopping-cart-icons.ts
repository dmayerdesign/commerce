import { prop, schema, MongooseDocument } from '../../goosetype'

@schema()
export class ShoppingCartIcons extends MongooseDocument {
    @prop() public empty: string
    @prop() public 1: string
    @prop() public 2: string
    @prop() public 3: string
    @prop() public full: string
}
