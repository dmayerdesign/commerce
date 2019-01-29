import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ProductListFilterUi } from '@qb/common/domains/product-list-filter-ui/product-list-filter-ui.interface'
import { ProductListFilter, ProductListFilterType } from '@qb/common/domains/product/product-list-filter'
import { TaxonomyTerm } from '@qb/common/domains/taxonomy-term/taxonomy-term.interface'
import { QbFormGroupOptions } from '@qb/common/modules/forms/models/form-group-options'
import { QbFormBuilderService } from '@qb/common/modules/forms/services/form-builder.service'
import { camelCase, kebabCase } from 'lodash'

@Component({
  selector: 'product-list-filter',
  template: `
    <pre><small>{{ filter | json }}</small></pre>

    <!-- Taxonomy term/attribute value checklist -->
    <ng-container *ngIf="isChecklist">
      <qb-form-field
        *ngFor="let controlName of formGroupControlNames"
        [options]="formGroupOptions[controlName]">
        <input #input
          type="checkbox"
          [formControl]="formControl"
        />
      </qb-form-field>
    </ng-container>
  `
})
export class ProductListFilterComponent implements OnInit {
  @Input() public filter: ProductListFilterUi
  @Output() public filterUpdate: EventEmitter<ProductListFilter>
  public formControl: FormControl
  public formGroup: FormGroup
  public formGroupControlNames: string[]
  public formGroupOptions: QbFormGroupOptions = {}
  public isChecklist: boolean

  constructor(
    private _formBuilderService: QbFormBuilderService
  ) { }

  public ngOnInit(): void {
    this.isChecklist =
      this.filter.filterType === ProductListFilterType.AttributeValue ||
      this.filter.filterType === ProductListFilterType.TaxonomyTerm

    if (
      this.filter.filterType === ProductListFilterType.TaxonomyTerm &&
      this.filter.taxonomyTermOptions
    ) {
      this.filter.taxonomyTermOptions.forEach((taxonomyTerm: TaxonomyTerm) => {
        // TaxonomyTerm slug -> form control name.
        const controlName = camelCase(taxonomyTerm.slug)
        this.formGroupOptions[controlName] = {
          defaultValue: false,
          label: taxonomyTerm.singularName || taxonomyTerm.slug,
          formControlType: 'checkbox',
        }
      })
      this.formGroup = this._formBuilderService.getFormGroup(this.formGroupOptions)
      this.formGroupControlNames = this._formBuilderService.getFormControlNames(this.formGroupOptions)

      this.formGroup.valueChanges.subscribe((formValue) => {
        this.filterUpdate.emit({
          type: ProductListFilterType.TaxonomyTerm,
          values: this.formGroupControlNames
            .map((controlName) => {
              if (formValue[controlName]) {
                // Form control name -> TaxonomyTerm slug.
                return kebabCase(controlName)
              } else {
                return undefined
              }
            })
            .filter((taxonomyTermSlug) => taxonomyTermSlug !== undefined)
        })
      })
    }
  }
}
