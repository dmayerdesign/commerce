import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { NavigationItem } from '@qb/common/domains/navigation-item/navigation-item.interface'
import { styles } from '@qb/generated/ui/style-variables.generated'

@Component({
  selector: 'web-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShopComponent implements OnInit {
  public hasAboveNavbar = true
  public aboveNavbarHeight = styles.aboveNavbarHeight.declarations[0].expression
  public aboveNavbarBgColor = styles.aboveNavbarBgColor.value.hex
  public aboveNavbarColor = styles.aboveNavbarColor.value.hex
  public navigationItems: Partial<NavigationItem>[] = [
    {
      text: 'Shop',
      routerLink: ['/'],
      className: 'some-class-name',
    },
    {
      text: 'Categories',
      onClick: () => {
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
      ],
    }
  ]

  public ngOnInit(): void {
    // Bulma.
    document.body.classList.add('has-navbar-fixed-top')
  }

}
