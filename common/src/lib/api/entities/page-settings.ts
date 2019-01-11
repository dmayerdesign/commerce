import { Column } from 'typeorm'
import { PageSettings as IPageSettings } from '../interfaces/page-settings'

export class PageSettings implements IPageSettings {
    @Column() public banner: string
    @Column() public bannerOverlay: string
}
