import { AppConfig } from '@qb/app-config'

function _getImageType(imageUrl: string, type: 'thumbnail' | 'medium' | 'large'): string {
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

export function getThumbnailImage(imageUrl: string): string {
    return _getImageType(imageUrl, 'thumbnail')
}

export function getMediumImage(imageUrl: string): string {
    return _getImageType(imageUrl, 'medium')
}

export function getLargeImage(imageUrl: string): string {
    return _getImageType(imageUrl, 'large')
}

export function getImageForSchema(src: string): string {
    if (src.indexOf('/') === 0) {
        src = src.substr(1)
    }
    return `${AppConfig.cloudfront_url}/${src}`
}
