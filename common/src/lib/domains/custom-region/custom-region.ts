import { ObjectID } from 'mongodb'
import { Column, Entity, JoinColumn, ObjectIdColumn, OneToMany } from 'typeorm'
import { CustomRegion as ICustomRegion } from './custom-region.interface'

@Entity()
export class CustomRegion implements ICustomRegion {
  @ObjectIdColumn() public id: ObjectID
  @Column() public isActive?: boolean
  @Column() public isMetaRegion?: boolean

  @OneToMany(() => CustomRegion, customRegion => customRegion.id)
  @JoinColumn()
  public childRegions?: CustomRegion[]

  @Column() public key?: string
  @Column() public className?: string
  @Column() public apiModel?: string
  @Column() public dataProperty?: string
  @Column() public dataArrayProperty?: string
  @Column() public pathToDataArrayPropertyLookupKey?: string
  @Column() public dataArrayPropertyLookupValue?: string
  @Column() public pathToDataPropertyValue?: string
  @Column() public template?: string
}
