import { Column, JoinColumn, ManyToMany } from 'typeorm'
import { UiContent as IUiContent } from '../interfaces/ui-content'
import { CustomRegions } from './custom-regions'
import { NavigationItem } from './navigation-item'

export class UiContent implements IUiContent {
    @ManyToMany(() => NavigationItem, x => x.id)
    @JoinColumn()
    public primaryNavigation?: NavigationItem[]

    @Column(() => CustomRegions) public customRegions?: CustomRegions
}
