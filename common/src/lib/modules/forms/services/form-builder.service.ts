import { Injectable } from '@angular/core'
import { FormBuilder } from '@angular/forms'

import { MteFormGroupOptions } from '../models/form-group-options'
import { MteFormBuilder } from '../utilities/form.builder'

@Injectable()
export class MteFormBuilderService {
    constructor(public formBuilder: FormBuilder) { }

    public create<DataType = any>(options: MteFormGroupOptions): MteFormBuilder<DataType> {
        return new MteFormBuilder<DataType>(this.formBuilder, options)
    }
}
