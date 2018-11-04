import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'mte-tooltip',
    template: `
<div class="tooltip"
		*ngIf="isShowing"
		[ngClass]="{'showing': isShowing}"
		[ngStyle]="{'opacity': fadeIn ? 1 : 0}">
	<ng-content></ng-content>
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MteTooltipComponent {
    public isShowing: boolean
    public fadeIn: boolean
    @Output() public showChange = new EventEmitter<boolean>()

    @Input() public get show(): boolean {
        return this.isShowing
    }
    public set show(isShowing: boolean) {
        if (isShowing) {
            this.isShowing = true
            setTimeout(() => { this.fadeIn = true }, 10)
            this.showChange.emit(this.isShowing)
        }
        else {
            this.fadeIn = false
            setTimeout(() => {
                this.isShowing = false
                this.showChange.emit(this.isShowing)
            }, 400)
        }
    }
}
