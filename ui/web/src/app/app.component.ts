import { isPlatformBrowser } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Inject, PLATFORM_ID } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: 'web-root',
  template: `
    <h1>Hello!</h1>
    <p>I am rendered on the <strong>{{ platform }}</strong></p>
    <p>Here's some data:</p>
    <pre>{{ data | async | json }}</pre>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'web'
  public platform = ''
  public data: Observable<any>

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
