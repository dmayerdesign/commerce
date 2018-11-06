import { Injectable } from '@angular/core'
import { FormBuilder } from '@angular/forms'

import { QbFormGroupOptions } from '../models/form-group-options'
import { QbFormBuilder } from '../utilities/form.builder'

@Injectable()
export class QbFormBuilderService {
    constructor(public formBuilder: FormBuilder) { }

    public create<DataType = any>(options: QbFormGroupOptions): QbFormBuilder<DataType> {
        return new QbFormBuilder<DataType>(this.formBuilder, options)
    }
}
