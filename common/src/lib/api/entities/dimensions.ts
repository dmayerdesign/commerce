import { Column } from 'typeorm'
import { Dimensions as IDimensions } from '../interfaces/dimensions'

export class Dimensions implements IDimensions {
  @Column() public length: number
  @Column() public width: number
  @Column() public height: number
}
