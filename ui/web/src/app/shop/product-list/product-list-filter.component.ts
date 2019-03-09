import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ProductListFilterUi } from '@qb/common/domains/product-list-filter-ui/product-list-filter-ui.interface'
import { ProductListFilter, ProductListFilterType } from '@qb/common/domains/product/product-list-filter'
import { TaxonomyTerm } from '@qb/common/domains/taxonomy-term/taxonomy-term.interface'
import { FormGroupOptions } from '@qb/common/modules/forms/models/form-group-options'
import { FormBuilderService } from '@qb/common/modules/forms/services/form-builder.service'
import { camelCase, kebabCase } from 'lodash'

@Component({
  selector: 'product-list-filter',
  template: `
    <pre><small>{{ filter | json }}</small></pre>

    <!-- Taxonomy term/attribute value checklist -->
    <ng-container *ngIf="isChecklist">
      <qb-web-form-field
        *ngFor="let controlName of formGroupControlNames"
        [options]="formGroupOptions[controlName]">
        <input #input
          type="checkbox"
          [formControl]="formControl"
        />
      </qb-web-form-field>
    </ng-container>
  `
})
export class ProductListFilterComponent implements OnInit {
  @Input() public filter: ProductListFilterUi
  @Output() public filterChange: EventEmitter<ProductListFilter>
  public formControl: FormControl
  public formGroup: FormGroup
  public formGroupControlNames: string[]
  public formGroupOptions: FormGroupOptions = {}
  public isChecklist: boolean

  constructor(
    private _formBuilderService: FormBuilderService
  ) { }

  public ngOnInit(): void {
    this.isChecklist =
      this.filter.filterType === ProductListFilterType.AttributeValue ||
      this.filter.filterType === ProductListFilterType.TaxonomyTerm

    if (
      this.filter.filterType === ProductListFilterType.TaxonomyTerm &&
      this.filter.taxonomyTermOptions
    ) {
      // TaxonomyTerm slug -> form control name.
      this.filter.taxonomyTermOptions.forEach((taxonomyTerm: TaxonomyTerm) => {
        const controlName = camelCase(taxonomyTerm.slug)
        this.formGroupOptions[controlName] = {
          defaultValue: false,
          label: taxonomyTerm.singularName || taxonomyTerm.slug,
          formControlType: 'checkbox',
        }
      })
      this.formGroup = this._formBuilderService
        .getFormGroup(this.formGroupOptions)
      this.formGroupControlNames = this._formBuilderService
        .getFormControlNames(this.formGroupOptions)

      // Form control name -> TaxonomyTerm slug.
      this.formGroup.valueChanges.subscribe((formValue) =>
        this.filterChange.emit({
          type: ProductListFilterType.TaxonomyTerm,
          values: this.formGroupControlNames
            .map((controlName) => {
              if (formValue[controlName]) {
                return kebabCase(controlName)
              } else {
                return undefined
              }
            })
            .filter((taxonomyTermSlug) => taxonomyTermSlug !== undefined)
        })
      )
    }
  }
}
