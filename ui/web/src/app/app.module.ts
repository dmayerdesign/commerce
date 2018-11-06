import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { QbFormsModule } from '@qb/common/modules/forms/forms.module'
import { QbUiModule } from '@qb/common/modules/ui/ui.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'web-ssr' }),
    QbFormsModule,
    QbUiModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
