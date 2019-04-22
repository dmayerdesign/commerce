import { Component, Input } from '@angular/core'
import { bulmaBreakpointKeys } from '@qb/common/constants/bulma/bulma-breakpoint-keys'
import { BulmaBreakpoint } from '@qb/common/constants/enums/bulma-breakpoint'
import { WindowService } from '../../services/window.service'

@Component({
    selector: 'qb-web-responsive-image',
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
    styleUrls: [ './responsive-image.component.scss' ]
})
export class ResponsiveImageComponent {
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
        public windowService: WindowService
    ) { }

    public getStyles(): { [key: string]: string|number } {
        const getBackgroundSize = (): string => {
            const nextHighestBreakpointKey = bulmaBreakpointKeys
                .find((key) => this.windowService.bulmaBreakpointBelow(key))

            return this.background
                ? BulmaBreakpoint[`${nextHighestBreakpointKey}Max`] + 'px auto'
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
