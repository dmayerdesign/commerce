import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms'

import { FormFieldComponent } from './components/form-field/form-field.component'
import { FormBuilderService } from './services/form-builder.service'

@NgModule({
  imports: [
    CommonModule,
    NgFormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FormFieldComponent,
  ],
  exports: [
    NgFormsModule,
    ReactiveFormsModule,
    FormFieldComponent,
  ],
  providers: [
    FormBuilderService
  ]
})
export class FormsModule {}
