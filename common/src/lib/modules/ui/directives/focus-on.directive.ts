import { Directive, ElementRef, Input, OnInit, Renderer } from '@angular/core'
import { Observable } from 'rxjs'

@Directive({
    selector: '[focusOn]'
})
export class FocusOnDirective implements OnInit {
    @Input() public focusOn: Observable<boolean>

    constructor(
        private el: ElementRef,
        private renderer: Renderer,
    ) {}

    public ngOnInit(): void {
        if (this.focusOn) {
            this.focusOn.subscribe(event => {
                if (event) {
                    this.renderer.invokeElementMethod(this.el.nativeElement, 'focus')
                }
            })
        }
    }
}
