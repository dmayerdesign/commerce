import { Injectable } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { FormFieldOptions } from '../models/form-field-options'
import { FormGroupOptions } from '../models/form-group-options'

@Injectable()
export class FormBuilderService {
    constructor(public formBuilder: FormBuilder) { }

    public getFormGroup(options: FormGroupOptions): FormGroup {
        const formGroupOptions = {}

        for (const optionKey in options) {
            const option = options[optionKey]
            const defaultValue = option.defaultValue == null ? '' : option.defaultValue
            const validators = option.validators || []
            formGroupOptions[optionKey] = [ defaultValue, validators ]
        }

        return this.formBuilder.group(formGroupOptions)
    }

    public getFormControl(options: FormFieldOptions): FormControl {
        const defaultValue = options.defaultValue == null ? '' : options.defaultValue
        const validators = options.validators || []
        const formControlArgs = [ defaultValue, validators ]

        return new FormControl(...formControlArgs)
    }

    public getFormControlNames(options: FormGroupOptions): string[] {
        return Object.keys(options)
    }
}
