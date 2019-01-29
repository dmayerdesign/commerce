import { isEqual, kebabCase, startCase } from 'lodash'
import { Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { VariableAttributeSelectOptionType } from '../../constants/enums/variable-attribute-select-option-type'
import { VariableAttributeSelectType } from '../../constants/enums/variable-attribute-select-type'
import { AttributeValue } from '../../domains/attribute-value/attribute-value.interface'
import { Attribute } from '../../domains/attribute/attribute.interface'
import { Product } from '../../domains/product/product.interface'
import { SimpleAttributeValue } from '../../domains/simple-attribute-value/simple-attribute-value.interface'
import { isAttributeValue } from '../../helpers/product.helpers'
import { Stateful } from '../common/stateful'

export class VariableAttributeSelectState {
    public selectedOption?: VariableAttributeSelectOption
    public matchingVariations?: Product[] = []
    public availableOptions?: VariableAttributeSelectOption[]
    public wasFirstSelected ? = false
    public allOptionsAreAvailable ? = false
}

export interface VariableAttributeSelectAttribute {
    slug: string
    displayName: string
    data: (Attribute | string) | (Attribute | string)[]
}

export interface VariableAttributeSelectOption {
    type?: VariableAttributeSelectOptionType
    label?: string
    data?: AttributeValue | string
    key?: string
    matchingVariations?: Product[]
    sourceOptions?: VariableAttributeSelectOption[]
}

export class VariableAttributeSelect extends Stateful<VariableAttributeSelectState> {
    public type: VariableAttributeSelectType
    public combination: VariableAttributeSelect[]
    protected _state = new VariableAttributeSelectState()
    private _productDetail: Product
    private _variations: Product[]
    private _attribute: VariableAttributeSelectAttribute
    private _options: VariableAttributeSelectOption[]
    private _matchingVariationsFilters = new Set<(matchingVariations: Product[]) => Product[]>()

    // Builder.

    public builder = {
        setProductDetail: (productDetail: Product) => {
            this._productDetail = productDetail
            this._variations = this._productDetail.variations as Product[]
            this.setState({
                matchingVariations: this._variations
                    .filter((variation) => variation.stockQuantity > 0)
            })
            return this.builder
        },
        setMatchingVariationsFilter: (
            filter: (matchingVariations: Product[]) => Product[]
        ) => {
            this._matchingVariationsFilters.add(filter)
        },
        setAttributesOrProperties: (attributesOrProperties: (Attribute | string)[]) => {
            const attributesAndOptions: {
                attribute: VariableAttributeSelectAttribute
                options: VariableAttributeSelectOption[]
            }[] = []

            attributesOrProperties.forEach((attributeOrProperty) => {
                let attribute: VariableAttributeSelectAttribute | undefined
                let options: VariableAttributeSelectOption[] = []
                const type = typeof attributeOrProperty === 'string'
                    ? VariableAttributeSelectType.Property
                    : VariableAttributeSelectType.Attribute

                // If it's a variable property:

                if (type === VariableAttributeSelectType.Property) {
                    attribute = {
                        slug: kebabCase(attributeOrProperty as string),
                        displayName: startCase(attributeOrProperty as string),
                        data: attributeOrProperty as Attribute,
                    }

                    options = this._variations.reduce<VariableAttributeSelectOption[]>(
                        (_options, variation) => {
                            const data = variation[(attribute as VariableAttributeSelectAttribute).data as string]
                            let dataForDisplay = ''

                            if (typeof data === 'object') {
                                if (data.currency) {
                                    dataForDisplay = `${data.currency}`
                                }
                                if (data.amount) {
                                    dataForDisplay = `${dataForDisplay}${data.amount}`
                                }
                                if (data.unitOfMeasurement) {
                                    dataForDisplay = `${dataForDisplay}${data.unitOfMeasurement}`
                                }
                            }
                            else {
                                dataForDisplay = data
                            }

                            const existingOption = _options.find((option) => isEqual(option.data, data))
                            if (!existingOption) {
                                _options.push({
                                    type: VariableAttributeSelectOptionType.PropertyValue,
                                    label: dataForDisplay,
                                    key: (attribute as VariableAttributeSelectAttribute).data as string,
                                    data,
                                    matchingVariations: [ variation ],
                                })
                            }
                            else if (existingOption.matchingVariations) {
                                existingOption.matchingVariations.push(variation)
                            }
                            return _options
                        },
                        []
                    )
                }

                // If it's an Attribute:

                else if (type === VariableAttributeSelectType.Attribute) {
                    attribute = {
                        slug: (attributeOrProperty as Attribute).slug,
                        displayName: startCase((attributeOrProperty as Attribute).singularName || (attributeOrProperty as Attribute).slug),
                        data: attributeOrProperty as Attribute
                    }

                    options = this._variations.reduce<VariableAttributeSelectOption[]>(
                        (_options, variation) => {
                            const allVariationAttributeValues: AttributeValue[] = [
                                ...variation.simpleAttributeValues as AttributeValue[],
                                ...variation.attributeValues as AttributeValue[],
                            ]

                            _options = _options.concat(
                                allVariationAttributeValues
                                    .map((attrValue) => {
                                        if (
                                            (attrValue.attribute as Attribute).id ===
                                            ((attribute as VariableAttributeSelectAttribute).data as Attribute).id
                                        ) {
                                            const existingOption = _options
                                                .find((option) => attrValue.value === (option.data as AttributeValue).value)
                                            if (!existingOption) {
                                                const label = (attrValue as AttributeValue).name || attrValue.value
                                                return {
                                                    type: isAttributeValue(attrValue) ? VariableAttributeSelectOptionType.AttributeValue : VariableAttributeSelectOptionType.SimpleAttributeValue,
                                                    label,
                                                    data: attrValue,
                                                    matchingVariations: [ variation ],
                                                } as VariableAttributeSelectOption
                                            }
                                            else if (existingOption.matchingVariations) {
                                                existingOption.matchingVariations.push(variation)
                                            }
                                        }
                                    }) as VariableAttributeSelectOption[]
                            )
                            return _options.filter((x) => x != null)
                        },
                        []
                    )
                }

                    attributesAndOptions.push({
                        attribute: attribute as VariableAttributeSelectAttribute,
                        options,
                    })
            })

            if (attributesOrProperties.length === 1) {
                if (attributesAndOptions[0].options[0].type === VariableAttributeSelectOptionType.PropertyValue) {
                    this.type = VariableAttributeSelectType.Property
                }
                else {
                    this.type = VariableAttributeSelectType.Attribute
                }
                this._attribute = attributesAndOptions[0].attribute
                this._options = attributesAndOptions[0].options
            }
            else if (attributesOrProperties.length === 2) {
                this.type = VariableAttributeSelectType.Combination

                this._attribute = {
                    slug: `${attributesAndOptions[0].attribute.slug}-and-${attributesAndOptions[1].attribute.slug}`,
                    displayName: `${startCase(attributesAndOptions[0].attribute.displayName)} / ${startCase(attributesAndOptions[1].attribute.displayName)}`,
                    data: attributesAndOptions.map(({ attribute }) => attribute.data) as Attribute[]
                }

                this._options = this._getCombinedOptions([
                    attributesAndOptions[0].options,
                    attributesAndOptions[1].options,
                ])
            }
            else if (attributesOrProperties.length > 2) {
                throw new Error('Combining more than 2 attributes in a select is not supported. Evaluating: ' + JSON.stringify(attributesOrProperties))
            }
            else {
                throw new Error('Cannot create a select from an empty array.')
            }

            return this.builder
        }
    }

    private _getCombinedOptions(preCombinedOptions: VariableAttributeSelectOption[][]): VariableAttributeSelectOption[] {
        const combinedOptions: VariableAttributeSelectOption[] = []
        const matchingVariations: Product[] = []

        // Use the (2) options arrays to create a flattened array of options.

        preCombinedOptions.forEach((options) => {
            options.forEach((option) => {
                if (option.matchingVariations) {
                    option.matchingVariations.forEach((matchingVariation) => {
                        if (!matchingVariations.find((p) => p.id === matchingVariation.id)) {
                            matchingVariations.push(matchingVariation)
                        }
                    })
                }
            })
        })

        matchingVariations.forEach((matchingVariation) => {
            const combinedOption: VariableAttributeSelectOption = {
                type: VariableAttributeSelectOptionType.Combination,
                sourceOptions: [],
                matchingVariations: [],
            }
            const sourceOptions =
                combinedOption.sourceOptions as VariableAttributeSelectOption[]
            const combinedOptionMatchingVariations =
                combinedOption.matchingVariations as Product[]

            preCombinedOptions.forEach((options) => {
                options.forEach((option) => {
                    if (option.matchingVariations) {
                        option.matchingVariations.forEach((matchingVar) => {
                            if (matchingVar === matchingVariation) {
                                sourceOptions.push(option)
                                if (!combinedOptionMatchingVariations.find(
                                    (mv) => mv.id === matchingVar.id
                                )) {
                                    combinedOptionMatchingVariations.push(matchingVar)
                                }
                            }
                        })
                    }
                })
            })

            if (sourceOptions.length !== preCombinedOptions.length) {
                throw new Error('Length mismatch - the combined options could not be built.')
            }

            combinedOption.label = sourceOptions.map((srcOption) => srcOption.label).join(' / ')

            combinedOptions.push(combinedOption)
        })

        return combinedOptions
    }

    // State selection and mutation.

    public get attribute(): VariableAttributeSelectAttribute {
        return this._attribute
    }

    public get options(): VariableAttributeSelectOption[] {
        return this._options
    }

    public set selectedOptionModel(selectedOption: VariableAttributeSelectOption) {
        this.select(selectedOption)
    }

    public get selectedOptionModel(): VariableAttributeSelectOption {
        return this.state.selectedOption as VariableAttributeSelectOption
    }

    public select(selectedOption?: VariableAttributeSelectOption): void {
        this.setState({ selectedOption })
    }

    public reset(): void {
        this.select()
    }

    public selectSilently(selectedOption: VariableAttributeSelectOption): void {
        this.setStateSilently({ selectedOption })
    }

    public get selectedOptionChanges(): Observable<VariableAttributeSelectOption | undefined> {
        return this.selectedOptionStream.pipe(distinctUntilChanged())
    }

    public get selectedOptionStream(): Observable<VariableAttributeSelectOption | undefined> {
        return this.states.pipe(
            map((state) => state.selectedOption),
        )
    }

    public optionIsAvailable(option: VariableAttributeSelectOption): boolean {
        return this.state.allOptionsAreAvailable
            || !!this.getAvailableOptions().find((availableOption) => isEqual(option, availableOption))
    }

    public getAvailableOptions(): VariableAttributeSelectOption[] {

        const getAvailableOptions = (options: VariableAttributeSelectOption[], debug = false) => {
            const availableOptions = options.filter((option) => {

                // Only return options whose data exists on at least one of the currently-matching in-stock variations.

                const someMatchingVariationsHaveOption =
                    !!this.state.matchingVariations &&
                    this.state.matchingVariations
                        .filter((variation) => variation.stockQuantity > 0)
                        .some((variation) => {

                            // If we're looking for an attribute value, test to see if any of the variation's
                            // `attributeValues` or `simpleAttributeValues` has a `value` equal to `option.data.value`.

                            if (option.type === VariableAttributeSelectOptionType.AttributeValue) {
                                const allAttributeValues: (AttributeValue | SimpleAttributeValue)[] = [
                                    ...variation.attributeValues as AttributeValue[],
                                    ...variation.simpleAttributeValues as SimpleAttributeValue[],
                                ]
                                const someAttributeValuesHaveValue = allAttributeValues
                                    .some(({ value, attribute }) =>
                                        ((option.data as AttributeValue).attribute as Attribute).slug === (attribute as Attribute).slug
                                        && (option.data as AttributeValue).value === value
                                    )
                                return someAttributeValuesHaveValue
                            }

                            // If we're looking for a property value, loop through the parent product's
                            // `variableProperties` to get the variation's values for those property keys,
                            // and try to find one of those values that's equal to `option`.

                            if (option.type === VariableAttributeSelectOptionType.PropertyValue) {
                                const variableProperties = this._productDetail.variableProperties
                                const someVariablePropertiesAreEqualToOption = variableProperties
                                    .map((key) => ({ key, value: variation[key] }))
                                    .some(({ key, value }) => {
                                        return key === option.key && isEqual(value, option.data)
                                    })
                                return someVariablePropertiesAreEqualToOption
                            }

                            return false
                        })

                return someMatchingVariationsHaveOption
            })

            return availableOptions
        }

        if (this.type === VariableAttributeSelectType.Combination) {
            const availableOptions: VariableAttributeSelectOption[] = []

            this.options.forEach((combinedOption) => {
                const _sourceOptions =
                    combinedOption.sourceOptions as VariableAttributeSelectOption[]

                if (getAvailableOptions(_sourceOptions).length === _sourceOptions.length) {
                    availableOptions.push(combinedOption)
                }
            })

            return availableOptions
        }
        else {
            return getAvailableOptions(this.options as VariableAttributeSelectOption[])
        }
    }

    // Update.

    public update(silent = false): void {
        const stateUpdate: VariableAttributeSelectState = {
            availableOptions: this.getAvailableOptions(),
        }

        if (stateUpdate.availableOptions && stateUpdate.availableOptions.length === 1) {
            stateUpdate.selectedOption = stateUpdate.availableOptions[0]
        }

        if (silent) {
            this.setStateSilently(stateUpdate)
        }
        else {
            this.setState(stateUpdate)
        }
    }
}
