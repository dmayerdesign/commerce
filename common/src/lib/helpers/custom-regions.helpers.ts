import { CustomRegion } from '../api/interfaces/custom-region'
import { CustomRegions } from '../api/interfaces/custom-regions'

export function hasDataForCustomRegion(customRegion: CustomRegion, data: any): boolean {
    return !!_getCustomRegionTextValueFromArrayProperty(customRegion, data)
}

export function getCustomRegionHtml(customRegion: CustomRegion, data: any): string {
    if (customRegion.isMetaRegion && !!customRegion.childRegions) {
        const childRegionsMap: { [key: string]: string } = {}
        let parsedTemplate = customRegion.template
        customRegion.childRegions.forEach((childRegion) => {
            childRegionsMap[childRegion.key] = _parseHtmlString(childRegion, data)
        })
        Object.keys(childRegionsMap).forEach((key) => {
            const interpolationMatch = customRegion.template
                .match(new RegExp('\\{\\{(\\s)*' + key + '(\\s)*\\}\\}', 'g'))
            const childRegionParsedHtml = childRegionsMap[key]
            if (!!interpolationMatch) {
                interpolationMatch.forEach((match) => parsedTemplate = parsedTemplate.replace(match, childRegionParsedHtml))
            }
        })
        return parsedTemplate
    } else {
        return _parseHtmlString(customRegion, data)
    }
}

export function getActiveCustomRegions(customRegions: CustomRegions): CustomRegions {
    const newCustomRegions = {
        productDetailInfoHeader: [],
        productDetailMid: []
    } as CustomRegions

    Object.keys(customRegions).map((key) => ({ key, value: customRegions[key] }) as { key: string, value: CustomRegion[] })
        .filter(({ key, value }) => Array.isArray(value) && value.every((element) => typeof element.isActive !== 'undefined'))
        .forEach(({ key, value }) => {
            newCustomRegions[key] = value.filter((cr) => cr.isActive)
        })

    return newCustomRegions
}

function _parseHtmlString(_customRegion: CustomRegion, _data: any): string {
    const delimiter1 = '{}' // TODO: Deprecate
    const delimiter2 = '%%'
    const value = _getCustomRegionTextValueFromArrayProperty(_customRegion, _data)

    if (!_customRegion.template) return value
    return _customRegion.template
        .split(delimiter1).join(value)
        .split(delimiter2).join(value)
}

function _getCustomRegionTextValueFromArrayProperty(customRegion: CustomRegion, data: any): string {
    function lookUpProperty(pathToDataArrayPropertyLookupKey: string): (prop: any) => any {
        return function(prop: any): any {
            let value = prop
            pathToDataArrayPropertyLookupKey.split('.').forEach((key) => {
                value = value[key]
            })
            return value === customRegion.dataArrayPropertyLookupValue
        }
    }
    const arrayElement = !!data[customRegion.dataArrayProperty]
        ? data[customRegion.dataArrayProperty].find(lookUpProperty(customRegion.pathToDataArrayPropertyLookupKey))
        : null
    if (!!arrayElement) {
        return `${arrayElement[customRegion.pathToDataPropertyValue]}`
    }
    return ''
}
