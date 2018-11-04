import { TemplateRef } from '@angular/core'
import { MongooseDocument } from './mongoose-document'
import { Ref } from './ref'

export interface NavigationItem extends MongooseDocument {
    text: string
    isTopLevel?: boolean
    className?: string
    routerLink: string[]
    children: Ref<NavigationItem>[]
    template: TemplateRef<any>
    context: any
}
