import { fromEvent, of, BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { BootstrapBreakpoint } from '../../../../constants/enums/bootstrap-breakpoint'
import { BootstrapBreakpointKey } from '../../../../constants/enums/bootstrap-breakpoint-key'

export class WindowRefService {
    private _window = typeof window !== 'undefined' ? window : null
    public scrollPositionY: number
    public scrollPositionYs: Observable<number>
    private scrollPositionYPump: BehaviorSubject<number>
    public width: number
    public widths: Observable<number>
    private widthPump: BehaviorSubject<number>
    public height: number
    public heights: Observable<number>
    private heightPump: BehaviorSubject<number>
    public htmlFontSizePx: number
    public htmlFontSizePxs: Observable<number>
    private htmlFontSizePxPump: BehaviorSubject<number>

    constructor() {
        if (this._window) {
            this.scrollPositionYPump = new BehaviorSubject(this._window.scrollY)
            this.scrollPositionYs = this.scrollPositionYPump.asObservable()
            this.widthPump = new BehaviorSubject(this._window.innerWidth)
            this.widths = this.widthPump.asObservable()
            this.heightPump = new BehaviorSubject(this._window.innerHeight)
            this.heights = this.heightPump.asObservable()
            this.htmlFontSizePxPump = new BehaviorSubject(this.getHtmlFontSizeInPx())
            this.htmlFontSizePxs = this.htmlFontSizePxPump.asObservable()
        }
        else {
            this.scrollPositionYs = of(0)
            this.widths = of(1280)
            this.heights = of(720)
            this.htmlFontSizePxs = of(10)
        }

        this.scrollPositionYs.subscribe((x) => this.scrollPositionY = x)
        this.widths.subscribe((x) => this.width = x)
        this.heights.subscribe((x) => this.height = x)
        this.htmlFontSizePxs.subscribe((x) => this.htmlFontSizePx = x)

        if (this._window) {
            fromEvent(this._window, 'scroll')
                .pipe(map(() => this._window.scrollY))
                .subscribe((x) => this.scrollPositionYPump.next(x))

            fromEvent(this._window, 'resize')
                .pipe(map(() => this._window.innerWidth))
                .subscribe((x) => {
                    this.widthPump.next(x)
                    this.htmlFontSizePxPump.next(this.getHtmlFontSizeInPx())
                })

            fromEvent(this._window, 'resize')
                .pipe(map(() => this._window.innerHeight))
                .subscribe((x) => this.heightPump.next(x))
        }
    }

    private getHtmlFontSizeInPx(): number {
        if (this._window && this._window.document.getElementsByTagName('html')[0]) {
            return parseFloat(this._window.getComputedStyle(this._window.document.getElementsByTagName('html')[0], null).getPropertyValue('font-size'))
        }
        else return 10
    }

    private mediaBreakpoint(breakpoint: BootstrapBreakpointKey, dir: 'above'|'below'): boolean {
        return dir === 'above'
            ? this.width >= BootstrapBreakpoint[breakpoint + 'Max']
            : this.width < BootstrapBreakpoint[breakpoint + 'Min']
    }

    public mediaBreakpointBelow(breakpoint: BootstrapBreakpointKey): boolean {
        return this.mediaBreakpoint(breakpoint, 'below')
    }

    public mediaBreakpointAbove(breakpoint: BootstrapBreakpointKey): boolean {
        return this.mediaBreakpoint(breakpoint, 'above')
    }

    public mediaBreakpoints(breakpoint: BootstrapBreakpointKey, dir: 'above'|'below'): Observable<boolean> {
        return this.widths.pipe(
            map((width) => dir === 'above'
                ? width >= BootstrapBreakpoint[breakpoint + 'Max']
                : width < BootstrapBreakpoint[breakpoint + 'Min']
            )
        )
    }

    public mediaBreakpointBelows(breakpoint: BootstrapBreakpointKey): Observable<boolean> {
        return this.mediaBreakpoints(breakpoint, 'below')
    }

    public mediaBreakpointAboves(breakpoint: BootstrapBreakpointKey): Observable<boolean> {
        return this.mediaBreakpoints(breakpoint, 'above')
    }
}
