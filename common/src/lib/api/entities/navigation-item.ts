import { TemplateRef } from '@angular/core'
import { arrayProp, model, prop, MongooseDocument, Ref } from '../../goosetype'

/**
 * A navigation item to be displayed in the UI
 * @description DO NOT "new up" this class from within a browser application. Default values are meant only to convey intent.
 */
@model(NavigationItem)
export class NavigationItem extends MongooseDocument {
    @prop() public text: string
    @prop() public isTopLevel = true
    @prop() public className?: string
    @arrayProp({ itemsType: String }) public routerLink: string[]
    @arrayProp({ itemsRef: NavigationItem }) public children: Ref<NavigationItem>[]

    public template: TemplateRef<any>
    public context: any
}

export class CreateNavigationItemError extends Error { }
export class FindNavigationItemError extends Error { }
export class UpdateNavigationItemError extends Error { }
export class DeleteNavigationItemError extends Error { }
