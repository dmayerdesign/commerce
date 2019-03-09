import { Component, Input, OnInit } from '@angular/core'
import { BootstrapBreakpointKey } from '@qb/common/constants/enums/bootstrap-breakpoint-key'
import { NavigationItem } from '@qb/common/domains/navigation-item/navigation-item.interface'
import { pullFrom, pushTo } from '@qb/common/helpers/array.helpers'
import { Memoized } from '@qb/common/helpers/function.helpers'
import { hasChildren } from '@qb/common/helpers/tree.helpers'
import { BehaviorSubject, Observable } from 'rxjs'
import { first, map, share } from 'rxjs/operators'
import { WindowRefService } from '../../services/window-ref.service'

export interface NavigationListContext {
  isParent: boolean
  items: NavigationItem[]
}

@Component({
  selector: 'qb-web-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrls: [ './navigation-list.component.scss' ],
})
export class NavigationListComponent implements OnInit {
  @Input() public items: NavigationItem[]
  @Input() public id: string

  public navItemsShowingChildren$ = new BehaviorSubject<NavigationItem[]>([])

  public navbarLinkStyles = {
    textTransform: 'uppercase',
    fontSize: '0.625rem',
    fontWeight: 'bold',
    letterSpacing: '0.02rem',
  }

  constructor(
    private windowRefService: WindowRefService
  ) { }

  public ngOnInit(): void {
  }

  @Memoized
  public isShowingChildren$(item: NavigationItem): Observable<boolean> {
    return this.navItemsShowingChildren$.pipe(
      map((navItems) => this.hasChildren(item) && navItems.includes(item)),
      share(),
    )
  }

  @Memoized
  public shouldShowDownArrow$(item: NavigationItem): Observable<boolean> {
    return this.windowRefService.mediaBreakpointAboves(BootstrapBreakpointKey.Sm).pipe(
      map((isAboveSm) => isAboveSm && this.hasChildren(item)),
      share(),
    )
  }

  @Memoized
  public shouldShowPlus$(item: NavigationItem): Observable<boolean> {
    return this.windowRefService.mediaBreakpointBelows(BootstrapBreakpointKey.Md).pipe(
      map((isBelowMd) => isBelowMd && this.hasChildren(item)),
      share(),
    )
  }

  @Memoized
  public hasChildren(item: NavigationItem): boolean {
    return hasChildren(item)
  }

  public handleNavLinkMouseEnter(item: NavigationItem): void {
    if (this.windowRefService.mediaBreakpointAbove(BootstrapBreakpointKey.Sm)) {
      this.navItemsShowingChildren$.next(
        pushTo<NavigationItem>(this.navItemsShowingChildren$.value, item)
      )
    }
  }

  public handleNavLinkMouseLeave(item: NavigationItem): void {
    if (this.windowRefService.mediaBreakpointAbove(BootstrapBreakpointKey.Sm)) {
      this.navItemsShowingChildren$.next(
        pullFrom<NavigationItem>(this.navItemsShowingChildren$.value, item)
      )
    }
  }

  public handleDropdownExpandClick(item: NavigationItem): void {
    this.isShowingChildren$(item).pipe(first()).subscribe((isShowingChildren) => {
      if (isShowingChildren) {
        this.navItemsShowingChildren$.next(
          pullFrom<NavigationItem>(this.navItemsShowingChildren$.value, item)
        )
      }
      else {
        this.navItemsShowingChildren$.next(
          pushTo<NavigationItem>(this.navItemsShowingChildren$.value, item)
        )
      }
    })
  }
}
