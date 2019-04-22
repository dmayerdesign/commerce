import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NavigationItem } from '@qb/common/domains/navigation-item/navigation-item.interface'
import { forLifeOf, MortalityAware } from '@qb/common/domains/ui-component/ui-component.helpers'
import { WindowService } from '@qb/common/modules/ui/services/window.service'
import { styles } from '@qb/generated/ui/style-variables.generated'
import { merge, Observable } from 'rxjs'
import { delay, map, withLatestFrom } from 'rxjs/operators'
import { ShopStore } from './shop.store'

@MortalityAware()
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
  public willHomeCarouselBeVisible$: Observable<boolean>
  public isNavbarTransparent$: Observable<boolean>
  public navbarPaddingBottom$: Observable<string>
  public mobileNavIsActive = false
  public navigationItems: Partial<NavigationItem>[] = [
    {
      text: 'Shop',
      routerLink: ['/'],
      className: 'some-class-name',
    },
    {
      text: 'Categories',
      onClick: () => { },
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
    private _windowService: WindowService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.isHomeCarouselVisible$ = this._shopStore.selectState('isHomeCarouselVisible')
    this.willHomeCarouselBeVisible$ = this._shopStore.selectState('willHomeCarouselBeVisible')
    this.isNavbarTransparent$ = merge(
      this.isHomeCarouselVisible$,
      this.willHomeCarouselBeVisible$,
    )

    this.navbarPaddingBottom$ = this.isNavbarTransparent$.pipe(
      map((isNavbarTransparent) => isNavbarTransparent ? this.navbarExtraHeight : '0')
    )

    merge(
      this.isHomeCarouselVisible$,
      this.willHomeCarouselBeVisible$,
      )
      .pipe(delay(0)).subscribe(() => {
        this._changeDetectorRef.detectChanges()
      })
  }

  public ngOnInit(): void {
    // Bulma.
    document.body.classList.add('has-navbar-fixed-top')

    // Prevent ExpressionChanged error.
    if (this._activatedRoute.snapshot.pathFromRoot.length <= 3) {
      this._shopStore.setState({
        isHomeCarouselVisible: true,
        willHomeCarouselBeVisible: true,
      })
    }

    if (!styles.shopHomeCarouselFeauxScroll.value) {
      // const getPxFromNavbarHeightStyle = (style: typeof styles.navbarHeight) => {
      //   if (style.unit === 'rem') {
      //     return style.value * styles.htmlFontSize.value
      //   }
      //   return style.value
      // }
      this._windowService.scrollPositionY$
        .pipe(
          forLifeOf(this),
          withLatestFrom(this._windowService.height$),
          map(([scrollPositionY]) =>
            // scrollPositionY < (windowHeight - getPxFromNavbarHeightStyle(styles.navbarHeight))
            scrollPositionY < 50
          )
        )
        .subscribe(
          (isHomeCarouselVisible) => this._shopStore.setState({
            isHomeCarouselVisible,
            willHomeCarouselBeVisible: isHomeCarouselVisible
          })
        )
    }
  }

  public toggleMobileNav(): void {
    this.mobileNavIsActive = !this.mobileNavIsActive
  }

}
