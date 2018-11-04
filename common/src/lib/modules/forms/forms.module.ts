import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { QbFormFieldComponent } from './components/form-field/form-field.component'
import { QbFormBuilderService } from './services/form-builder.service'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    QbFormFieldComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    QbFormFieldComponent,
  ],
  providers: [
    QbFormBuilderService
  ]
})
export class QbFormsModule {}
