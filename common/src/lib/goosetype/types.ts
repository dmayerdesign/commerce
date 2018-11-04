import { PropOptions, ValidateNumberOptions, ValidateStringOptions } from './interfaces'

export type PropOptionsWithNumberValidate = PropOptions & ValidateNumberOptions
export type PropOptionsWithStringValidate = PropOptions & ValidateStringOptions
export type PropOptionsWithValidate = PropOptionsWithNumberValidate | PropOptionsWithStringValidate
export type Ref<T> = T | string
