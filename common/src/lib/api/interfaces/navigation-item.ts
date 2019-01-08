import { TemplateRef } from '@angular/core'
import { Entity } from './entity'

export interface NavigationItem extends Entity {
    text: string
    isTopLevel?: boolean
    className?: string
    routerLink: string[]
    children: NavigationItem[]
    template: TemplateRef<any>
    context: any
}
