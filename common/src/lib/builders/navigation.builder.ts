import { NavigationItem } from '../api/interfaces/navigation-item'

// @dynamic
export class NavigationBuilder {
    public items(items: NavigationItem[]): NavigationItem[] {
        return items.map((item) => {
            // Set defaults here.
            // (No defaults yet.)
            return item
        })
    }
}
