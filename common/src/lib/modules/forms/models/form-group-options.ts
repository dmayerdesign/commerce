import { MteFormFieldOptions } from './form-field-options'

export interface MteFormGroupOptions {
    [key: string]: MteFormFieldOptions & {
        defaultValue?: any
        validators?: any[]
    }
}
