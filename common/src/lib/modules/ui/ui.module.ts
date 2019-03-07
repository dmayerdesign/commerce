import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ClickOutsideModule } from 'ng-click-outside'
import { QbInstagramFeedComponent } from './components/instagram-feed/instagram-feed.component'
import { QbModalComponent } from './components/modal/modal.component'
import { QbNavigationListComponent } from './components/navigation/navigation-list.component'
import { QbRangeSliderComponent } from './components/range-slider/range-slider.component'
import { QbResponsiveImageComponent } from './components/responsive-image/responsive-image.component'
import { QbRippleComponent } from './components/ripple/ripple.component'
import { QbToastComponent } from './components/toast/toast.component'
import { QbTooltipComponent } from './components/tooltip/tooltip.component'
import { FocusOnDirective } from './directives/focus-on.directive'
import { TruncatePipe } from './pipes/truncate.pipe'
import { WindowRefService } from './services/window-ref.service'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([]),
        FormsModule,
        ReactiveFormsModule,
        ClickOutsideModule,
    ],
    declarations: [
        // Components.
        QbInstagramFeedComponent,
        QbModalComponent,
        QbNavigationListComponent,
        QbRangeSliderComponent,
        QbResponsiveImageComponent,
        QbRippleComponent,
        QbToastComponent,
        QbTooltipComponent,
        // Directives.
        FocusOnDirective,
        TruncatePipe,
    ],
    exports: [
        // Modules.
        CommonModule,
        ClickOutsideModule,
        // Components.
        QbInstagramFeedComponent,
        QbModalComponent,
        QbNavigationListComponent,
        QbRangeSliderComponent,
        QbResponsiveImageComponent,
        QbRippleComponent,
        QbToastComponent,
        QbTooltipComponent,
        // Directives.
        FocusOnDirective,
        TruncatePipe,
    ],
})
export class QbUiModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: QbUiModule,
            providers: [
                WindowRefService
            ]
        }
    }
}
