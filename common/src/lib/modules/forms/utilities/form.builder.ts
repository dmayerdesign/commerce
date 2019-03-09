import { AbstractControl, FormBuilder as NgFormBuilder, FormGroup } from '@angular/forms'
import { FormFieldOptions } from '../models/form-field-options'
import { FormGroupOptions } from '../models/form-group-options'

export class FormBuilder<DataType = any> {
  public data?: DataType
  private _formGroup: FormGroup
  private _controls: AbstractControl[]
  private _controlNames: string[]
  private _formFieldOptions: { [key: string]: FormFieldOptions } = {}

  constructor(
    private formBuilder: NgFormBuilder,
    private _options: FormGroupOptions,
  ) {
    this.init()
  }

  private init(): void {
    if (!this._formGroup) {
      const formGroupOptions = {}

      for (const option in this._options) {
        const defaultValue = this._options[option].defaultValue == null ? '' : this._options[option].defaultValue
        const validators = this._options[option].validators || []
        formGroupOptions[option] = [ defaultValue, validators ]
      }

      this._formGroup = this.formBuilder.group(formGroupOptions)
      this._controlNames = Object.keys(this._formGroup.controls)
      this._controls = this._controlNames.map((controlName) =>
        this._formGroup.get(controlName)) as AbstractControl[]
      this._controlNames.forEach((controlName) => {
        this._formFieldOptions[controlName] = {
          ...this._options[controlName] as FormFieldOptions,
          label: this._options[controlName].label,
          control: this._formGroup.get(controlName) as AbstractControl,
          errorMessages: this._options[controlName].errorMessages
        }
      })
    }
  }

  public getOptions(controlName: string): FormFieldOptions {
    return this._formFieldOptions[controlName]
  }

  public get formGroup(): FormGroup {
    return this._formGroup
  }

  public get controls(): AbstractControl[] {
    return this._controls
  }

  public get controlNames(): string[] {
    return this._controlNames
  }
}
