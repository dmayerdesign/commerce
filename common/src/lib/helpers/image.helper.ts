import { AppConfig } from '@mte/app-config'

export class ImageHelper {
    private static getImageType(imageUrl: string, type: 'thumbnail' | 'medium' | 'large'): string {
        if (!imageUrl) {
            return ''
        }
        const types = [ 'thumbnail', 'medium', 'large' ]
        types.forEach((t) => {
            if (t !== type) {
                imageUrl = imageUrl.replace(`-${t}.`, `-${type}.`)
            }
        })
        return imageUrl
    }

    public static getThumbnailImage(imageUrl: string): string {
        return this.getImageType(imageUrl, 'thumbnail')
    }

    public static getMediumImage(imageUrl: string): string {
        return this.getImageType(imageUrl, 'medium')
    }

    public static getLargeImage(imageUrl: string): string {
        return this.getImageType(imageUrl, 'large')
    }

    public static getImageForSchema(src: string): string {
        if (src.indexOf('/') === 0) {
            src = src.substr(1)
        }
        return `${AppConfig.cloudfront_url}/${src}`
    }
}
