import { Column } from 'typeorm'

export class Dimensions {
  @Column() public length: number
  @Column() public width: number
  @Column() public height: number
}
