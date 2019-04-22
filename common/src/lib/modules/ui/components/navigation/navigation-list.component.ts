import { Component, Input } from '@angular/core'
import { BulmaBreakpointKey } from '@qb/common/constants/enums/bulma-breakpoint-key'
import { NavigationItem } from '@qb/common/domains/navigation-item/navigation-item.interface'
import { hasChildren } from '@qb/common/helpers/tree.helpers'
import { combineLatest, BehaviorSubject, Observable } from 'rxjs'
import { first, map, share } from 'rxjs/operators'
import { WindowService } from '../../services/window.service'

export interface NavigationListContext {
  isParent: boolean
  items: NavigationItem[]
}

@Component({
  selector: 'qb-web-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrls: [ './navigation-list.component.scss' ],
})
export class NavigationListComponent {
  @Input() public items: NavigationItem[]
  @Input() public id: string

  public isShowingChildrenMap = new Map<NavigationItem, Observable<boolean>>()
  public navItemsShowingChildren$ = new BehaviorSubject<Set<NavigationItem>>(new Set())

  public navbarLinkStyles = {
    textTransform: 'uppercase',
    fontSize: '0.625rem',
    fontWeight: 'bold',
    letterSpacing: '0.02rem',
  }

  constructor(
    private _windowService: WindowService
  ) { }

  public isShowingChildren$(item: NavigationItem): Observable<boolean> {
    // if (item.text.toLowerCase() === 'categories') {
    //   return of(true)
    // }
    if (this.isShowingChildrenMap.has(item)) {
      return this.isShowingChildrenMap.get(item) as Observable<boolean>
    }
    return this.isShowingChildrenMap
      .set(item, combineLatest(
          this.navItemsShowingChildren$,
          this._windowService.bulmaBreakpointBelow$(BulmaBreakpointKey.Lg)
        ).pipe(
          map(([navItems, isLgBelow]) => {
            return isLgBelow || (
              navItems.has(item) && this.hasChildren(item)
            )
          }),
      ))
      .get(item) as Observable<boolean>
  }

  public shouldShowDownArrow$(item: NavigationItem): Observable<boolean> {
    return this._windowService.bulmaBreakpointAbove$(BulmaBreakpointKey.Md).pipe(
      map((isAboveSm) => isAboveSm && this.hasChildren(item)),
      share(),
    )
  }

  public isExpandableByTap$(item: NavigationItem): Observable<boolean> {
    return this._windowService.bulmaBreakpointBelow$(BulmaBreakpointKey.Lg).pipe(
      map((isBelowLg) => isBelowLg && this.hasChildren(item)),
      share(),
    )
  }

  public hasChildren(item: NavigationItem): boolean {
    return hasChildren(item)
  }

  public handleNavLinkMouseEnter(item: NavigationItem): void {
    if (this._windowService.bulmaBreakpointAbove(BulmaBreakpointKey.Md)) {
      this.navItemsShowingChildren$.next(
        this.navItemsShowingChildren$.value.add(item)
      )
    }
  }

  public handleNavLinkMouseLeave(item: NavigationItem): void {
    if (this._windowService.bulmaBreakpointAbove(BulmaBreakpointKey.Md)) {
      this.navItemsShowingChildren$.value.delete(item)
      this.navItemsShowingChildren$.next(
        this.navItemsShowingChildren$.value
      )
    }
  }

  public handleDropdownExpandClick(item: NavigationItem): void {
    this.isShowingChildren$(item).pipe(first()).subscribe((isShowingChildren) => {
      if (isShowingChildren) {
        this.navItemsShowingChildren$.value.delete(item)
        this.navItemsShowingChildren$.next(
          new Set(this.navItemsShowingChildren$.value)
        )
      }
      else {
        this.navItemsShowingChildren$.next(
          new Set(this.navItemsShowingChildren$.value.add(item))
        )
      }
    })
  }
}
