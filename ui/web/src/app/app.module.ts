import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { QbFormsModule } from '@qb/common/modules/forms/forms.module'
import { QbUiModule } from '@qb/common/modules/ui/ui.module'
import { AppComponent } from './app.component'
import { routes } from './app.routes'

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'web-ssr' }),
    RouterModule.forRoot(routes),
    HttpClientModule,
    QbFormsModule,
    QbUiModule.forRoot(),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
