import { TemplateRef } from '@angular/core'
import { Document } from '@qb/common/goosetype/interfaces'
import { Ref } from './ref'

export interface NavigationItem extends Document {
    text: string
    isTopLevel?: boolean
    className?: string
    routerLink: string[]
    children: Ref<NavigationItem>[]
    template: TemplateRef<any>
    context: any
}
