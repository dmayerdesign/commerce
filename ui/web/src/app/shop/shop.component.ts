import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NavigationItem } from '@qb/common/domains/navigation-item/navigation-item.interface'
import { styles } from '@qb/generated/ui/style-variables.generated'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ShopStore } from './shop.store'

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
  public navbarExtraHeight = styles.navbarExtraHeight.declarations[0].expression
  public navbarBgColor = styles.colorPrimary.value.hex
  public isHomeCarouselVisible$: Observable<boolean>
  public navbarPaddingBottom$: Observable<string>

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

  constructor(
    private _shopStore: ShopStore,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.isHomeCarouselVisible$ = this._shopStore.select('isHomeCarouselVisible')
    this.navbarPaddingBottom$ = this.isHomeCarouselVisible$.pipe(
      map((isHomeCarouselVisible) => isHomeCarouselVisible ? this.navbarExtraHeight : '0')
    )
  }

  public ngOnInit(): void {
    // Bulma.
    document.body.classList.add('has-navbar-fixed-top')

    // Prevent ExpressionChanged error.
    if (this._activatedRoute.snapshot.pathFromRoot.length <= 3) {
      this._shopStore.setState({ isHomeCarouselVisible: true })
    }
  }

}
