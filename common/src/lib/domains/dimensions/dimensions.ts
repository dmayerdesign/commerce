import { Column } from 'typeorm'
import { Dimensions as IDimensions } from './dimensions.interface'

export class Dimensions implements IDimensions {
  @Column() public length: number
  @Column() public width: number
  @Column() public height: number
}
