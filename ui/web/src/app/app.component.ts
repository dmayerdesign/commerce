import { Component, Inject } from '@angular/core'
import { BOOT_CONDITIONS } from '@qb/common/constants/angular/injection-tokens'
import { Preboot } from '@qb/common/models/ui/preboot'
import { combineLatest, Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'

@Component({
  selector: 'web-root',
  template: `
    <ng-container *ngIf="ready$ | async; else loading">
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
  public data: Observable<any>
  public ready$: Observable<boolean>

  constructor(
    @Inject(BOOT_CONDITIONS) private _bootConditions: Preboot[],
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
  }
}
