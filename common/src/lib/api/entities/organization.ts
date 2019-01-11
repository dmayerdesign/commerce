import { Column, CreateDateColumn, Entity, JoinColumn, ObjectIdColumn, ObjectID, OneToMany, UpdateDateColumn } from 'typeorm'
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
    @Column() public name: string
    @Column(() => OrganizationRetailSettings) public retailSettings: OrganizationRetailSettings
    @Column(() => OrganizationBranding) public branding: OrganizationBranding
    @Column() public storeUrl: string
    @Column(() => UiContent) public storeUiContent: UiContent
    @Column({ enum: OrganizationType }) public type?: OrganizationType
    @Column() public dbaNames?: string[]
    @Column(() => UiContent) public blogUiContent?: UiContent
    @Column(() => StoreUiSettings) public storeUiSettings?: StoreUiSettings

    @OneToMany(() => Taxonomy, taxonomy => taxonomy.id)
    @JoinColumn()
    public searchableTaxonomies?: Taxonomy[]

    @Column(() => GlobalStyles) public globalStyles?: GlobalStyles
    @Column() public defaultsHaveBeenSet?: boolean
    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
