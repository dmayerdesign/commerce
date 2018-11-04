import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MteFormFieldComponent } from './components/form-field/form-field.component'
import { MteFormBuilderService } from './services/form-builder.service'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    MteFormFieldComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MteFormFieldComponent,
  ],
  providers: [
    MteFormBuilderService
  ]
})
export class MteFormsModule {}
