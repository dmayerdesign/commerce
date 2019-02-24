import { isPlatformBrowser } from '@angular/common'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Component, Inject, PLATFORM_ID } from '@angular/core'
import { FormControl } from '@angular/forms'
import { BOOT_CONDITIONS } from '@qb/common/constants/angular/injection-tokens'
import { Crud } from '@qb/common/constants/crud'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request.interface'
import { Preboot } from '@qb/common/models/ui/preboot'
import { combineLatest, Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'

@Component({
  selector: 'web-root',
  template: `
    <ng-container *ngIf="ready$ | async; else loading">
      <h1>Hello!</h1>
      <!-- <p>I am rendered on the <strong>{{ platform }}</strong></p> -->
      <p>Here's some data:</p>
      <pre>{{ data | async | json }}</pre>
      <h2>Form stuff</h2>
      <div>
        You typed: {{ control.value }}
      </div>
      <qb-form-field [options]="{ label: 'Type something!' }">
        <input #input [formControl]="control">
      </qb-form-field>

      <router-outlet></router-outlet>
    </ng-container>
    <ng-template #loading>
      <p>Loading...</p>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'web'
  public platform = ''
  public data: Observable<any>
  public control = new FormControl()
  public ready$: Observable<boolean>

  constructor(
    @Inject(PLATFORM_ID) private _platformId: object,
    @Inject(BOOT_CONDITIONS) private _bootConditions: Preboot[],
    private _httpClient: HttpClient,
  ) {
    this.ready$ = combineLatest(
      this._bootConditions.map(
        ({ ready$ }) => ready$.pipe(
          filter((isReady) => isReady)
        )
      ))
      .pipe(
        map((readyReports) => readyReports.every((isReady) => isReady))
      )

    this.platform = isPlatformBrowser(this._platformId)
      ? 'browser'
      : 'server'

    const request = {
      limit: 5,
    } as ListRequest

    const params = new HttpParams()
      .set(Crud.Params.listRequest, JSON.stringify(request))
    this.data = this._httpClient.get('/api/products', { params })
  }
}
