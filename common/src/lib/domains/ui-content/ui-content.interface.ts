import { CustomRegions } from '../custom-regions/custom-regions.interface'
import { NavigationItem } from '../navigation-item/navigation-item.interface'

export interface UiContent {
    primaryNavigation?: NavigationItem[]
    customRegions?: CustomRegions
}
