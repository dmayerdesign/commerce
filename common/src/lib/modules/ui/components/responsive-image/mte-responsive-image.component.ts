import { Component, Input } from '@angular/core'
import { bootstrapBreakpointKeys } from '../../../../../constants/bootstrap/bootstrap-breakpoint-keys'
import { BootstrapBreakpoint } from '../../../../../constants/enums/bootstrap-breakpoint'
import { WindowRefService } from '../../services/window-ref.service'

@Component({
    selector: 'mte-responsive-image',
    template: `
        <div class="responsive-image noselect"
             [ngStyle]="getStyles()">

            <span *ngIf="!!alt"
                  class="sr-only">
                {{ alt }}
            </span>

            <img *ngIf="!!overlaySrc"
                 class="noselect"
                 [src]="overlaySrc"
                 [alt]="overlayAlt"
                 [ngStyle]="getOverlayStyles()">
        </div>
    `,
    styleUrls: [ './mte-responsive-image.component.scss' ]
})
export class MteResponsiveImageComponent {
    @Input() public src: string
    @Input() public alt: string
    @Input() public width = '100%'
    @Input() public height: string
    @Input() public overlaySrc: string
    @Input() public overlayAlt: string
    @Input() public overlayWidth = 'auto'
    @Input() public overlayHeight = 'auto'
    @Input() public background = false

    constructor(
        public windowRefService: WindowRefService
    ) { }

    public getStyles(): { [key: string]: string|number } {
        const getBackgroundSize = (): string => {
            const nextHighestBreakpointKey = bootstrapBreakpointKeys
                .find((key) => this.windowRefService.mediaBreakpointBelow(key))

            return this.background
                ? BootstrapBreakpoint[`${nextHighestBreakpointKey}Max`] + 'px auto'
                : 'cover'
        }

        return {
            backgroundImage: `url(${this.src})`,
            backgroundSize: getBackgroundSize(),
            backgroundPosition: '50% 50%',
            height: this.height,
            width: this.width,
        }
    }

    public getOverlayStyles(): { [key: string]: string|number } {
        return {
            height: this.overlayHeight,
            width: this.overlayWidth,
        }
    }
}
