import { Column } from 'typeorm'

export class PageSettings {
    @Column() public banner: string
    @Column() public bannerOverlay: string
}
