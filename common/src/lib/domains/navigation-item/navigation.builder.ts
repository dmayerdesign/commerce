import { NavigationItem } from './navigation-item.interface'

export class NavigationBuilder {
    public items(items: NavigationItem[]): NavigationItem[] {
        return items.map((item) => {
            // Set defaults here.
            // (No defaults yet.)
            return item
        })
    }
}
