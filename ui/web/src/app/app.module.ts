import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { BOOT_CONDITIONS } from '@qb/common/constants/angular/injection-tokens'
import { QbFormsModule } from '@qb/common/modules/forms/forms.module'
import { QbUiModule } from '@qb/common/modules/ui/ui.module'
import { AppComponent } from './app.component'
import { routes } from './app.routes'
import { OrganizationService } from './organization/organization.service'

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'web-ssr' }),
    RouterModule.forRoot(routes),
    HttpClientModule,
    QbFormsModule,
    QbUiModule.forRoot(),
  ],
  exports: [
    RouterModule,
    HttpClientModule,
    QbFormsModule,
    QbUiModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    {
      provide: BOOT_CONDITIONS,
      useExisting: OrganizationService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
