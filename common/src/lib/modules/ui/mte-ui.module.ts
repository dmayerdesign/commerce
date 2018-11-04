import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ClickOutsideModule } from 'ng-click-outside'

import { MteInstagramFeedComponent } from './components/instagram-feed/qb-instagram-feed.component'
import { MteModalComponent } from './components/modal/qb-modal.component'
import { MteNavigationListComponent } from './components/navigation/qb-navigation-list.component'
import { MteRangeSliderComponent } from './components/range-slider/qb-range-slider.component'
import { MteResponsiveImageComponent } from './components/responsive-image/qb-responsive-image.component'
import { MteRippleComponent } from './components/ripple/ripple.component'
import { MteToastComponent } from './components/toast/qb-toast.component'
import { MteTooltipComponent } from './components/tooltip/qb-tooltip.component'

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
        MteInstagramFeedComponent,
        MteModalComponent,
        MteNavigationListComponent,
        MteRangeSliderComponent,
        MteResponsiveImageComponent,
        MteRippleComponent,
        MteToastComponent,
        MteTooltipComponent,
        // Directives.
        FocusOnDirective,
        TruncatePipe,
    ],
    exports: [
        // Modules.
        CommonModule,
        ClickOutsideModule,
        // Components.
        MteInstagramFeedComponent,
        MteModalComponent,
        MteNavigationListComponent,
        MteRangeSliderComponent,
        MteResponsiveImageComponent,
        MteRippleComponent,
        MteToastComponent,
        MteTooltipComponent,
        // Directives.
        FocusOnDirective,
        TruncatePipe,
    ],
})
export class MteUiModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: MteUiModule,
            providers: [
                WindowRefService
            ]
        }
    }

    public static forChild(): ModuleWithProviders {
        return {
            ngModule: MteUiModule
        }
    }
}
