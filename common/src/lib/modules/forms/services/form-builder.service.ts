import { Injectable } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { QbFormFieldOptions } from '../models/form-field-options'
import { QbFormGroupOptions } from '../models/form-group-options'

@Injectable()
export class QbFormBuilderService {
    constructor(public formBuilder: FormBuilder) { }

    public getFormGroup(options: QbFormGroupOptions): FormGroup {
        const formGroupOptions = {}

        for (const optionKey in options) {
            const option = options[optionKey]
            const defaultValue = option.defaultValue == null ? '' : option.defaultValue
            const validators = option.validators || []
            formGroupOptions[optionKey] = [ defaultValue, validators ]
        }

        return this.formBuilder.group(formGroupOptions)
    }

    public getFormControl(options: QbFormFieldOptions): FormControl {
        const defaultValue = options.defaultValue == null ? '' : options.defaultValue
        const validators = options.validators || []
        const formControlArgs = [ defaultValue, validators ]

        return new FormControl(...formControlArgs)
    }

    public getFormControlNames(options: QbFormGroupOptions): string[] {
        return Object.keys(options)
    }
}
