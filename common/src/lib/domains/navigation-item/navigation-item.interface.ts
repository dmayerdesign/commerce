import { TemplateRef } from '@angular/core'
import { Entity } from '../data-access/entity.interface'

export interface NavigationItem extends Entity {
    text: string
    isTopLevel?: boolean
    className?: string
    routerLink: string[]
    children: NavigationItem[]
    template: TemplateRef<any>
    context: any
}
