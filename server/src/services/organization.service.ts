import { Attribute } from '@mte/common/api/entities/attribute'
import { AttributeValue } from '@mte/common/api/entities/attribute-value'
import { NavigationItem } from '@mte/common/api/entities/navigation-item'
import { Organization } from '@mte/common/api/entities/organization'
import { Taxonomy } from '@mte/common/api/entities/taxonomy'
import { TaxonomyTerm } from '@mte/common/api/entities/taxonomy-term'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { ApiResponse } from '@mte/common/api/responses/api.response'
import { Copy } from '@mte/common/constants/copy'
import { HttpStatus } from '@mte/common/constants/http-status'
import { Types } from '@mte/common/constants/inversify/types'
import { inject, injectable } from 'inversify'
import { hyzershop } from '../../work-files/data/organization_hyzershop'
import { DbClient } from '../data-access/db-client'
import { CrudService } from './crud.service'

@injectable()
export class OrganizationService extends CrudService<Organization> {

    protected model = Organization

    constructor(
        @inject(Types.DbClient) protected dbClient: DbClient<Organization>
    ) { super() }

    public getOrganization(): Promise<ApiResponse<Organization>> {
        return new Promise<ApiResponse<Organization>>(async (resolve, reject) => {
            try {
                const organization = await this.dbClient.findOne(Organization, {}, [
                    {
                        path: 'storeUiContent.primaryNavigation',
                        model: NavigationItem.getModel(),
                        populate: {
                            path: 'children',
                        },
                    },
                    {
                        path: 'storeUiSettings.productsFilters.taxonomyTermOptions',
                        model: TaxonomyTerm.getModel(),
                        populate: {
                            path: 'taxonomy',
                            model: Taxonomy.getModel(),
                        },
                    },
                    {
                        path: 'storeUiSettings.productsFilters.attributeValueOptions',
                        model: AttributeValue.getModel(),
                        populate: {
                            path: 'attribute',
                            model: Attribute.getModel(),
                        },
                    },
                ])

                if (!organization) {
                    reject(new ApiErrorResponse(new Error(Copy.ErrorMessages.findOrganizationError), HttpStatus.CLIENT_ERROR_NOT_FOUND))
                    return
                }

                resolve(new ApiResponse(organization))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }

    public create(): any {
        return super.create([ hyzershop ])

        /*
        RAW (possibly more up to date):

        {"_id":"5a8517f707da82fdd9568302","updatedAt":"2018-02-15T05:17:43.981Z","createdAt":"2018-02-15T05:17:43.981Z","name":"Hyzer Shop","retailSettings":{"salesTaxPercentage":6,"addSalesTax":false,"shippingFlatRate":{"amount":5,"currency":"USD"},"_id":"5a8517f707da82fdd9568306"},"branding":{"logo":"https://d1eqpdomqeekcv.cloudfront.net/branding/hyzershop-wordmark-250.png","colors":{"primary":"#00b0ff","_id":"5a8517f707da82fdd9568305"},"cartName":"basket","displayName":"Hyzer Shop","_id":"5a8517f707da82fdd9568304"},"storeUrl":"http://localhost:3000/shop","storeUiContent":{"_id":"5a8517f707da82fdd9568303","primaryNavigation":["5a85163ea5697de9dc39d4ae","5a85163ea5697de9dc39d4af","5a85163ea5697de9dc39d4b0","5a85163ea5697de9dc39d4b1","5a85163ea5697de9dc39d4b2","5a85163ea5697de9dc39d4b3","5a85163ea5697de9dc39d4b4"],"customRegions":{"productDetailInfoHeader":[{"isMetaRegion":true,"isActive":true,"className":"ff-display product-detail-info--disc-specs-label text-uppercase font-weight-bold","template":"<span class=\"product-detail-info--disc-specs-label--disc-type\">{{ discType }}</span><span class=\"product-detail-info--disc-specs-label--mid-dot\">•</span><span class=\"product-detail-info--disc-specs-label--stability\">{{ stability }}</span>","childRegions":[{"apiModel":"Product","dataArrayProperty":"taxonomyTerms","pathToDataArrayPropertyLookupKey":"taxonomy.slug","dataArrayPropertyLookupValue":"disc-type","pathToDataPropertyValue":"singularName","key":"discType"},{"apiModel":"Product","dataArrayProperty":"taxonomyTerms","pathToDataArrayPropertyLookupKey":"taxonomy.slug","dataArrayPropertyLookupValue":"stability","pathToDataPropertyValue":"singularName","key":"stability"}]},{"apiModel":"Product","className":"product-detail-info--flight-stat--speed","dataArrayProperty":"simpleAttributeValues","dataArrayPropertyLookupValue":"speed","pathToDataArrayPropertyLookupKey":"attribute.slug","pathToDataPropertyValue":"value","template":"<span class=\"flight-stats-bubble flight-stats-bubble--speed\"><span class=\"flight-stats-bubble--label\">Speed</span><span class=\"flight-stats-bubble--value\">{}</span></span>","isActive":true},{"apiModel":"Product","className":"product-detail-info--flight-stat--glide","dataArrayProperty":"simpleAttributeValues","dataArrayPropertyLookupValue":"glide","pathToDataArrayPropertyLookupKey":"attribute.slug","pathToDataPropertyValue":"value","template":"<span class=\"flight-stats-bubble flight-stats-bubble--glide\"><span class=\"flight-stats-bubble--label\">Glide</span><span class=\"flight-stats-bubble--value\">{}</span></span>","isActive":true},{"apiModel":"Product","className":"product-detail-info--flight-stat--turn","dataArrayProperty":"simpleAttributeValues","dataArrayPropertyLookupValue":"turn","pathToDataArrayPropertyLookupKey":"attribute.slug","pathToDataPropertyValue":"value","template":"<span class=\"flight-stats-bubble flight-stats-bubble--turn\"><span class=\"flight-stats-bubble--label\">Turn</span><span class=\"flight-stats-bubble--value\">{}</span></span>","isActive":true},{"apiModel":"Product","className":"product-detail-info--flight-stat--fade","dataArrayProperty":"simpleAttributeValues","dataArrayPropertyLookupValue":"fade","pathToDataArrayPropertyLookupKey":"attribute.slug","pathToDataPropertyValue":"value","template":"<span class=\"flight-stats-bubble flight-stats-bubble--fade\"><span class=\"flight-stats-bubble--label\">Fade</span><span class=\"flight-stats-bubble--value\">{}</span></span>","isActive":true}],"productDetailMid":[{"isMetaRegion":true,"isActive":false,"className":"product-detail-mid--specs","template":"<h2>Specs</h2>{{ stability }}{{ discType }}","childRegions":[{"apiModel":"Product","className":"product-detail-mid--specs--stability","dataArrayProperty":"attributeValues","pathToDataArrayPropertyLookupKey":"attribute.slug","dataArrayPropertyLookupValue":"stability","pathToDataPropertyValue":"singularName","template":"<dt class=\"ff-display-2\">Stability</dt><dd>{}</dd>","key":"stability"},{"apiModel":"Product","className":"product-detail-mid--specs--disc-type","dataArrayProperty":"taxonomyTerms","pathToDataArrayPropertyLookupKey":"taxonomy.slug","dataArrayPropertyLookupValue":"disc-type","pathToDataPropertyValue":"singularName","template":"<dt class=\"ff-display-2\">Type</dt><dd>{}</dd>","key":"discType"}]}]}},"storeUiSettings":{"orderOfVariableAttributeSelects":["plastic","color"],"combinedVariableAttributeSelects":[["color","netWeight"]],"productsFilters":[{"filterType":"price-range","enabled":true,"displayAlways":true}]},"globalStyles":{"backgroundPatternImageSrc":"https://d1eqpdomqeekcv.cloudfront.net/branding/bg-texture.gif","shoppingCartIcons":{"1":"https://d1eqpdomqeekcv.cloudfront.net/branding/basket-white-1.png","2":"https://d1eqpdomqeekcv.cloudfront.net/branding/basket-white-2.png","3":"https://d1eqpdomqeekcv.cloudfront.net/branding/basket-white-3.png","empty":"https://d1eqpdomqeekcv.cloudfront.net/branding/basket-white-empty.png","full":"https://d1eqpdomqeekcv.cloudfront.net/branding/basket-white-4.png"}},"__v":0}
        */
    }
}
