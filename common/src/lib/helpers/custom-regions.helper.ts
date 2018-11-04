import { CustomRegion } from '../api/entities/custom-region'
import { CustomRegions } from '../api/entities/custom-regions'

export class CustomRegionsHelper {
    public static hasDataForCustomRegion(customRegion: CustomRegion, data: any): boolean {
        return !!this._getCustomRegionTextValueFromArrayProperty(customRegion, data)
    }

    public static getCustomRegionHtml(customRegion: CustomRegion, data: any): string {
        if (customRegion.isMetaRegion && !!customRegion.childRegions) {
            const childRegionsMap: { [key: string]: string } = {}
            let parsedTemplate = customRegion.template
            customRegion.childRegions.forEach((childRegion) => {
                childRegionsMap[childRegion.key] = this._parseHtmlString(childRegion, data)
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
            return this._parseHtmlString(customRegion, data)
        }
    }

    public static getActiveCustomRegions(customRegions: CustomRegions): CustomRegions {
        const newCustomRegions: CustomRegions = {
            productDetailInfoHeader: [],
            productDetailMid: []
        }

        Object.keys(customRegions).map((key) => ({ key, value: customRegions[key] }) as { key: string, value: CustomRegion[] })
            .filter(({ key, value }) => Array.isArray(value) && value.every((element) => typeof element.isActive !== 'undefined'))
            .forEach(({ key, value }) => {
                newCustomRegions[key] = value.filter((cr) => cr.isActive)
            })

        return newCustomRegions
    }

    private static _parseHtmlString(_customRegion: CustomRegion, _data: any): string {
        const delimiter1 = '{}' // TODO: Deprecate
        const delimiter2 = '%%'
        const value = this._getCustomRegionTextValueFromArrayProperty(_customRegion, _data)

        if (!_customRegion.template) return value
        return _customRegion.template
            .split(delimiter1).join(value)
            .split(delimiter2).join(value)
    }

    private static _getCustomRegionTextValueFromArrayProperty(customRegion: CustomRegion, data: any): string {
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
}
