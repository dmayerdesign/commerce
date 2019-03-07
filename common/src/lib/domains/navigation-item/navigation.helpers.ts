import { NavigationItem } from './navigation-item.interface'

export function buildNavigation(items: Partial<NavigationItem>[]): NavigationItem[] {
  return items.map((item, index) => {
    return Object.assign<NavigationItem, Partial<NavigationItem>>({
      // Set defaults here. (No defaults yet.)
      text: `Navigation item ${index}`,
      routerLink: [''],
      children: [],
      className: ''
    }, item)
  })
}
