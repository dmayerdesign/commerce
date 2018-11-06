import { QbFormFieldOptions } from './form-field-options'

export interface QbFormGroupOptions {
    [key: string]: QbFormFieldOptions & {
        defaultValue?: any
        validators?: any[]
    }
}
