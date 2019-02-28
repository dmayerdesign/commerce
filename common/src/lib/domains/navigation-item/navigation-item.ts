import { TemplateRef } from '@angular/core'
import { ObjectId } from 'mongodb'
import { Column, Entity, JoinColumn, ObjectIdColumn, OneToMany } from 'typeorm'
import { NavigationItem as INavigationItem } from './navigation-item.interface'

/**
 * A navigation item to be displayed in the UI
 * @description DO NOT "new up" this class from within a browser application. Default values are meant only to convey intent.
 */
@Entity()
export class NavigationItem implements INavigationItem {
    @ObjectIdColumn() public id: ObjectId
    @Column() public text: string
    @Column() public isTopLevel = true
    @Column() public className?: string
    @Column() public routerLink: string[]

    @OneToMany(() => NavigationItem, navigationItem => navigationItem.id)
    @JoinColumn()
    public children: NavigationItem[]

    // Browser-specific
    public template: TemplateRef<any>
    public context: any
}
