import { Column, JoinColumn, ManyToMany } from 'typeorm'
import { CustomRegions } from '../custom-regions/custom-regions'
import { NavigationItem } from '../navigation-item/navigation-item'
import { UiContent as IUiContent } from './ui-content.interface'

export class UiContent implements IUiContent {
    @ManyToMany(() => NavigationItem, x => x.id)
    @JoinColumn()
    public primaryNavigation?: NavigationItem[]

    @Column(() => CustomRegions) public customRegions?: CustomRegions
}
