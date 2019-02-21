import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { organizations } from '@qb/common/constants/api-endpoints'
import { Organization } from '@qb/common/domains/organization/organization.interface'
import { Preboot } from '@qb/common/models/ui/preboot'
import { Observable } from 'rxjs'
import { mapTo } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class OrganizationService implements Preboot {
  public organization$: Observable<Organization>
  public ready$: Observable<boolean>

  constructor(
    private _httpClient: HttpClient,
  ) {
    this.organization$ = this._httpClient.get<Organization>(
      `/api/${organizations}/primary`
    )

    this.ready$ = this.organization$.pipe(
      // TODO: un-comment and use this instead of mapTo.
      // map((organization) => !!organization)
      mapTo(true)
    )
  }
}
