import { Component } from '@angular/core'
import { platform } from '../../utils/platform'

@Component({
    selector: 'mte-ripple',
    template: `
        <div class="ripple" *ngFor="let ripple of ripples"
            [ngStyle]="ripple.style">
            <div class="inner-ripple"></div>
            <div class="outer-ripple"></div>
        </div>
    `,
    styleUrls: [ './ripple.component.scss' ],
})
export class MteRippleComponent {
    public ripples = []

    constructor() {
        if (platform.isBrowser()) {
            window.addEventListener('click', (event: MouseEvent) => {
                const left = event.pageX
                const top = event.pageY

                let ripples = [ ...this.ripples ]
                ripples.unshift({ style: this.getStyle(left, top) })
                this.ripples = ripples

                setTimeout(() => {
                    ripples = [ ...this.ripples ]
                    ripples.pop()
                    this.ripples = ripples
                }, 1100)
            })
        }
    }

    public getStyle(left: number, top: number): object {
        return { 'transform': `translate(${left}px, ${top}px)` }
    }
}
