import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Product } from '@qb/common/api/interfaces/product'
import { ListRequest } from '@qb/common/api/requests/list.request'

@Component({
  selector: 'product-list-filter',
  template: `

  `
})
export class ProductListFilterComponent implements OnInit {
  @Input() public listRequest: ListRequest<Product>
  @Output() public listRequestUpdate: EventEmitter<ListRequest<Product>>
  private _formGroup: FormGroup

  public ngOnInit(): void {
  }
}
