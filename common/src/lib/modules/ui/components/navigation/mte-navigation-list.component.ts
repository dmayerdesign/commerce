import { Component, Input } from '@angular/core'
import { ArrayHelper } from '../../../../../helpers/array.helper'
import { TreeHelper } from '../../../../../helpers/tree.helper'
import { NavigationItem } from '../../../../../api/entities/navigation-item'
import { BootstrapBreakpointKey } from '../../../../../constants/enums/bootstrap-breakpoint-key'
import { WindowRefService } from '../../services/window-ref.service'

export interface NavigationListContext {
    isParent: boolean
    isChild: boolean
    items: NavigationItem[]
}

@Component({
    selector: 'mte-navigation-list',
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
                    [ngClass]="getNavItemClassList(item)"
                    (mouseenter)="handleNavLinkMouseEnter(item)"
                    (mouseleave)="handleNavLinkMouseLeave(item)">

                    <a *ngIf="item.routerLink"
                       #routerLink
                       class="nav-link"
                       [routerLink]="item.routerLink">

                        <span *ngIf="item.text && !item.template" class="nav-link-text">{{ item.text }}</span>
                        <ng-container *ngIf="item.template">
                            <ng-container *ngTemplateOutlet="item.template; context: item.context"></ng-container>
                        </ng-container>
                        <span *ngIf="routerLink.isActive" class="sr-only">(current)</span>
                    </a>

                    <a *ngIf="!item.routerLink"
                       class="nav-link"
                       href="javascript:void(0)">

                        <span class="nav-link-text">{{ item.text }}</span>
                        <ng-container *ngIf="item.template">
                            <ng-container *ngTemplateOutlet="item.template; context: item.context"></ng-container>
                        </ng-container>
                    </a>

                    <i *ngIf="shouldShowDownArrow(item)"
                       class="material-icons">
                       expand_more
                    </i>

                    <i *ngIf="shouldShowPlus(item) && !isShowingChildren(item)"
                       class="material-icons"
                       (click)="handleDropdownExpandClick(item)">
                       add
                    </i>

                    <i *ngIf="shouldShowPlus(item) && isShowingChildren(item)"
                       class="material-icons"
                       (click)="handleDropdownExpandClick(item)">
                       close
                    </i>

                    <ng-container *ngIf="isShowingChildren(item)">

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

        <ng-container *ngTemplateOutlet="navigationList; context: {
            $implicit: {
                items: items,
                isParent: true
            }
        }"></ng-container>
    `,
})
export class MteNavigationListComponent {
    @Input() public items: NavigationItem[]
    @Input() public id: string
    public navItemsShowingChildren: NavigationItem[] = []
    public treeHelper = TreeHelper

    constructor(
        private windowRefService: WindowRefService
    ) {}

    public isShowingChildren(item: NavigationItem): boolean {
        return TreeHelper.hasChildren(item)
            && !!this.navItemsShowingChildren.find((navItem) => item === navItem)
    }

    public handleNavLinkMouseEnter(item: NavigationItem): void {
        if (this.windowRefService.mediaBreakpointAbove(BootstrapBreakpointKey.Sm)) {
            ArrayHelper.pushTo<NavigationItem>(this.navItemsShowingChildren, item)
        }
    }

    public handleNavLinkMouseLeave(item: NavigationItem): void {
        if (this.windowRefService.mediaBreakpointAbove(BootstrapBreakpointKey.Sm)) {
            ArrayHelper.pullFrom<NavigationItem>(this.navItemsShowingChildren, item)
        }
    }

    public handleDropdownExpandClick(item: NavigationItem): void {
        if (this.isShowingChildren(item)) {
            ArrayHelper.pullFrom<NavigationItem>(this.navItemsShowingChildren, item)
        }
        else {
            ArrayHelper.pushTo<NavigationItem>(this.navItemsShowingChildren, item)
        }
    }

    public getId(ctx: NavigationListContext): string {
        if (ctx.isParent) {
            return this.id
        }
        else if (ctx.isChild) {
            return this.id + '-dropdown-menu'
        }
        else {
            return ''
        }
    }

    public shouldShowDownArrow(item: NavigationItem): boolean {
        return TreeHelper.hasChildren(item) && this.windowRefService.mediaBreakpointAbove(BootstrapBreakpointKey.Sm)
    }

    public shouldShowPlus(item: NavigationItem): boolean {
        return TreeHelper.hasChildren(item) && this.windowRefService.mediaBreakpointBelow(BootstrapBreakpointKey.Md)
    }

    public getNavItemClassList(item: NavigationItem): string[] {
        const classList = []
        if (TreeHelper.hasChildren(item)) {
            classList.push('dropdown')
        }
        if (!!item.className) {
            classList.push(item.className)
        }
        return classList
    }
}
