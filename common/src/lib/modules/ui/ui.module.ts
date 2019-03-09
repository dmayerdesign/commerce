import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ClickOutsideModule } from 'ng-click-outside'
import { InstagramFeedComponent } from './components/instagram-feed/instagram-feed.component'
import { ModalComponent } from './components/modal/modal.component'
import { NavigationListComponent } from './components/navigation/navigation-list.component'
import { RangeSliderComponent } from './components/range-slider/range-slider.component'
import { ResponsiveImageComponent } from './components/responsive-image/responsive-image.component'
import { RippleComponent } from './components/ripple/ripple.component'
import { ToastComponent } from './components/toast/toast.component'
import { TooltipComponent } from './components/tooltip/tooltip.component'
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
        InstagramFeedComponent,
        ModalComponent,
        NavigationListComponent,
        RangeSliderComponent,
        ResponsiveImageComponent,
        RippleComponent,
        ToastComponent,
        TooltipComponent,
        // Directives.
        FocusOnDirective,
        TruncatePipe,
    ],
    exports: [
        // Modules.
        CommonModule,
        ClickOutsideModule,
        // Components.
        InstagramFeedComponent,
        ModalComponent,
        NavigationListComponent,
        RangeSliderComponent,
        ResponsiveImageComponent,
        RippleComponent,
        ToastComponent,
        TooltipComponent,
        // Directives.
        FocusOnDirective,
        TruncatePipe,
    ],
})
export class UiModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: UiModule,
            providers: [
                WindowRefService
            ]
        }
    }
}
