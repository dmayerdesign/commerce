import { Component, OnInit } from '@angular/core'
import { NavigationItem } from '@qb/common/domains/navigation-item/navigation-item.interface'

@Component({
  selector: 'web-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  public navigationItems: Partial<NavigationItem>[] = [
    {
      text: 'Shop',
      routerLink: ['/'],
      className: 'some-class-name'
    },
    {
      text: 'Categories',
      onClick: (): void => {
        console.log('hello from ' + this.constructor.name)
      },
      children: [
        {
          text: 'Mens',
          routerLink: ['/'],
        },
        {
          text: 'Womens',
          routerLink: ['/'],
        }
      ] as NavigationItem[],
    }
  ]

  public ngOnInit(): void {
  }

}
