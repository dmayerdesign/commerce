import { isPlatformBrowser } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Inject, PLATFORM_ID } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'

@Component({
  selector: 'web-root',
  template: `
    <h1>Hello!</h1>
    <p>I am rendered on the <strong>{{ platform }}</strong></p>
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
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'web'
  public platform = ''
  public data: Observable<any>
  public control = new FormControl()

  constructor(
    @Inject(PLATFORM_ID) private _platformId: object,
    private _httpClient: HttpClient,
  ) {
    this.platform = isPlatformBrowser(this._platformId)
      ? 'browser'
      : 'server'

    this.data = this._httpClient.get('/api')
  }
}
