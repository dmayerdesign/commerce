import { Component, Input } from '@angular/core'
import { BootstrapBreakpointKey } from '@qb/common/constants/enums/bootstrap-breakpoint-key'
import { NavigationItem } from '@qb/common/domains/navigation-item/navigation-item.interface'
import { pullFrom, pushTo } from '@qb/common/helpers/array.helpers'
import { Memoize } from '@qb/common/helpers/function.helpers'
import { hasChildren } from '@qb/common/helpers/tree.helpers'
import { BehaviorSubject, Observable } from 'rxjs'
import { first, map } from 'rxjs/operators'
import { WindowRefService } from '../../services/window-ref.service'

export interface NavigationListContext {
  isParent: boolean
  isChild: boolean
  items: NavigationItem[]
}

@Component({
  selector: 'qb-navigation-list',
  template: `
    <ng-template #navigationList let-ctx>
      <ul [ngClass]="{
          'navbar-nav': ctx.isParent,
          'dropdown-menu': ctx.isChild,
          'dropdown-submenu': !ctx.isParent && !ctx.isChild
        }"
        [id]="getId(ctx)">

        <li *ngFor="let item of ctx.items"
          class="nav-item"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          [className]="item?.className"
          [ngClass]="{
            'dropdown': hasChildren(item)
          }"
          (mouseenter)="handleNavLinkMouseEnter(item)"
          (mouseleave)="handleNavLinkMouseLeave(item)">

          <a *ngIf="item.routerLink"
             #routerLink
             class="nav-link"
             [routerLink]="item.routerLink">

            <span *ngIf="item.text && !item.template" class="nav-link-text">
              {{ item.text }}
            </span>
            <span *ngIf="routerLink.isActive" class="sr-only">(current)</span>
          </a>

          <a *ngIf="!item.routerLink"
             class="nav-link"
             href="javascript:void(0)"
             (click)="item.onClick($event, item)">

            <span class="nav-link-text">{{ item.text }}</span>
          </a>

          <i *ngIf="shouldShowDownArrow$(item) | async"
             class="material-icons">
             expand_more
          </i>

          <i *ngIf="(shouldShowPlus$(item) | async) && !(isShowingChildren$(item) | async)"
             class="material-icons"
             (click)="handleDropdownExpandClick(item)">
             add
          </i>

          <i *ngIf="(shouldShowPlus$(item) | async) && (isShowingChildren$(item) | async)"
             class="material-icons"
             (click)="handleDropdownExpandClick(item)">
             close
          </i>

          <ng-container *ngIf="(isShowingChildren$(item) | async)">

            <ng-container *ngTemplateOutlet="navigationList; context: {
              $implicit: {
                items: item.children,
                isChild: ctx.isParent
              }
            }"></ng-container>

          </ng-container>
        </li>
      </ul>
    </ng-template>

    <ng-container *ngTemplateOutlet="
      navigationList;
      context: {
        $implicit: {
          items: items,
          isParent: true
        }
      }
    ">
    </ng-container>
  `,
})
export class QbNavigationListComponent {
  @Input() public items: NavigationItem[]
  @Input() public id: string

  public navItemsShowingChildren$ = new BehaviorSubject<NavigationItem[]>([])
  public hasChildren = hasChildren

  constructor(
    private windowRefService: WindowRefService
  ) { }

  @Memoize
  public isShowingChildren$(item: NavigationItem): Observable<boolean> {
    return this.navItemsShowingChildren$.pipe(
      map((navItems) => hasChildren(item)
        && !!navItems.find((navItem) => item === navItem))
    )
  }

  @Memoize
  public shouldShowDownArrow$(item: NavigationItem): Observable<boolean> {
    return this.windowRefService.mediaBreakpointAboves(BootstrapBreakpointKey.Sm).pipe(
      map((isAboveSm) => isAboveSm && hasChildren(item))
    )
  }

  @Memoize
  public shouldShowPlus$(item: NavigationItem): Observable<boolean> {
    return this.windowRefService.mediaBreakpointBelows(BootstrapBreakpointKey.Md).pipe(
      map((isBelowMd) => isBelowMd && hasChildren(item))
    )
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

  public getId(ctx: NavigationListContext): string {
    if (ctx.isParent) {
      return this.id
    }
    else if (ctx.isChild) {
      return this.id + '-dropdown-menu'
    }
    return ''
  }
}
