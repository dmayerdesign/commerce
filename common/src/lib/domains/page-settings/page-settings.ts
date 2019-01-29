import { Column } from 'typeorm'
import { PageSettings as IPageSettings } from './page-settings.interface'

export class PageSettings implements IPageSettings {
    @Column() public banner: string
    @Column() public bannerOverlay: string
}
