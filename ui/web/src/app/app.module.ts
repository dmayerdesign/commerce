import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { ServiceWorkerModule } from '@angular/service-worker'
import { BOOT_CONDITIONS } from '@qb/common/constants/angular/injection-tokens'
import { FormsModule } from '@qb/common/modules/forms/forms.module'
import { UiModule } from '@qb/common/modules/ui/ui.module'
import { environment } from '../environments/environment'
import { AppComponent } from './app.component'
import { appRoutes } from './app.routes'
import { OrganizationService } from './organization/organization.service'

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'web-ssr' }),
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    UiModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FlexLayoutModule,
  ],
  exports: [
    RouterModule,
    HttpClientModule,
    FormsModule,
    UiModule,
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
