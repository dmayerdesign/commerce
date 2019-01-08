import { Column, CreateDateColumn, Entity, ObjectIdColumn, ObjectID, OneToMany, UpdateDateColumn } from 'typeorm'
import { OrganizationType } from '../../constants/enums/organization-type'
import { Organization as IOrganization } from '../interfaces/organization'
import { GlobalStyles } from './global-styles'
import { OrganizationBranding } from './organization-branding'
import { OrganizationRetailSettings } from './organization-retail-settings'
import { StoreUiSettings } from './store-ui-settings'
import { Taxonomy } from './taxonomy'
import { UiContent } from './ui-content'

@Entity()
export class Organization implements IOrganization {
    @ObjectIdColumn() public id: ObjectID
    @Column({ enum: OrganizationType }) public type?: OrganizationType
    @Column() public name: string
    @Column() public dbaNames: string[]
    @Column() public retailSettings: OrganizationRetailSettings
    @Column() public branding: OrganizationBranding
    @Column() public storeUrl: string
    @Column() public storeUiContent: UiContent
    @Column() public blogUiContent?: UiContent
    @Column() public storeUiSettings?: StoreUiSettings
    @OneToMany(() => Taxonomy, taxonomy => taxonomy.id) public searchableTaxonomies?: Taxonomy[]
    @Column() public globalStyles?: GlobalStyles
    @Column() public defaultsHaveBeenSet: boolean
    @CreateDateColumn({ type: 'timestamp' }) public createdAt: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt: Date
}
