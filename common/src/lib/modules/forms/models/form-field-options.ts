import { AbstractControl, FormControl } from '@angular/forms'

export interface MteFormFieldOptions {
    label: string
    labelClass?: string
    hideLabel?: boolean
    control?: FormControl | AbstractControl
    errorMessages?: { [errorType: string]: string }
    formControlType?: 'input'|'select'|'checkbox'
    data?: any
}
