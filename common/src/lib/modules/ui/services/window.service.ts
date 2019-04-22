import { BootstrapBreakpoint } from '@qb/common/constants/enums/bootstrap-breakpoint'
import { BootstrapBreakpointKey } from '@qb/common/constants/enums/bootstrap-breakpoint-key'
import { BulmaBreakpoint } from '@qb/common/constants/enums/bulma-breakpoint'
import { BulmaBreakpointKey } from '@qb/common/constants/enums/bulma-breakpoint-key'
import { fromEvent, of, BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class WindowService {
  private _window ?= typeof window !== 'undefined' ? window : undefined
  public scrollPositionY$: Observable<number>
  private scrollPositionYß: BehaviorSubject<number>
  public width$: Observable<number>
  private widthß: BehaviorSubject<number>
  public height$: Observable<number>
  private heightß: BehaviorSubject<number>
  public htmlFontSizePx$: Observable<number>
  private htmlFontSizePxß: BehaviorSubject<number>

  constructor() {
    if (this._window) {
      this.scrollPositionYß = new BehaviorSubject(this._window.scrollY)
      this.scrollPositionY$ = this.scrollPositionYß.asObservable()
      this.widthß = new BehaviorSubject(this._window.innerWidth)
      this.width$ = this.widthß.asObservable()
      this.heightß = new BehaviorSubject(this._window.innerHeight)
      this.height$ = this.heightß.asObservable()
      this.htmlFontSizePxß = new BehaviorSubject(this.getHtmlFontSizeInPx())
      this.htmlFontSizePx$ = this.htmlFontSizePxß.asObservable()
    }
    else {
      this.scrollPositionY$ = of(0)
      this.width$ = of(1280)
      this.height$ = of(720)
      this.htmlFontSizePx$ = of(10)
    }

    if (typeof this._window !== 'undefined') {
      fromEvent(this._window, 'scroll')
        .pipe(map(() => (this._window as Window).scrollY))
        .subscribe((x) => this.scrollPositionYß.next(x))

      fromEvent(this._window, 'resize')
        .pipe(map(() => (this._window as Window).innerWidth))
        .subscribe((x) => {
          this.widthß.next(x)
          this.htmlFontSizePxß.next(this.getHtmlFontSizeInPx())
        })

      fromEvent(this._window, 'resize')
        .pipe(map(() => (this._window as Window).innerHeight))
        .subscribe((x) => this.heightß.next(x))
    }
  }

  public get scrollPositionY(): number {
    return this.scrollPositionYß.value
  }

  public get width(): number {
    return this.widthß.value
  }

  public get height(): number {
    return this.heightß.value
  }

  public get htmlFontSizePx(): number {
    return this.htmlFontSizePxß.value
  }

  private getHtmlFontSizeInPx(): number {
    if (
      this._window &&
      this._window.document.getElementsByTagName('html')[0]
    ) {
      return parseFloat(
        this._window
          .getComputedStyle(
            this._window.document.getElementsByTagName('html')[0],
            null
          )
          .getPropertyValue('font-size')
      )
    }
    else return 10
  }

  private bootstrapBreakpoint(
    breakpoint: BootstrapBreakpointKey,
    dir: 'above'|'below'
  ): boolean {
    return dir === 'above'
      ? this.width >= BootstrapBreakpoint[breakpoint + 'Max']
      : this.width < BootstrapBreakpoint[breakpoint + 'Min']
  }

  public bootstrapBreakpointBelow(breakpoint: BootstrapBreakpointKey): boolean {
    return this.bootstrapBreakpoint(breakpoint, 'below')
  }

  public bootstrapBreakpointAbove(breakpoint: BootstrapBreakpointKey): boolean {
    return this.bootstrapBreakpoint(breakpoint, 'above')
  }

  public bootstrapBreakpoint$(
    breakpoint: BootstrapBreakpointKey,
    dir: 'above'|'below',
  ): Observable<boolean> {
    return this.width$.pipe(
      map((width) => dir === 'above'
        ? width >= BootstrapBreakpoint[breakpoint + 'Max']
        : width < BootstrapBreakpoint[breakpoint + 'Min']
      )
    )
  }

  public bootstrapBreakpointBelow$(
    breakpoint: BootstrapBreakpointKey
  ): Observable<boolean> {
    return this.bootstrapBreakpoint$(breakpoint, 'below')
  }

  public bootstrapBreakpointAbove$(
    breakpoint: BootstrapBreakpointKey
  ): Observable<boolean> {
    return this.bootstrapBreakpoint$(breakpoint, 'above')
  }

  private bulmaBreakpoint(
    breakpoint: BulmaBreakpointKey,
    dir: 'above'|'below'
  ): boolean {
    return dir === 'above'
      ? this.width >= BulmaBreakpoint[breakpoint + 'Max']
      : this.width < BulmaBreakpoint[breakpoint + 'Min']
  }

  public bulmaBreakpointBelow(breakpoint: BulmaBreakpointKey): boolean {
    return this.bulmaBreakpoint(breakpoint, 'below')
  }

  public bulmaBreakpointAbove(breakpoint: BulmaBreakpointKey): boolean {
    return this.bulmaBreakpoint(breakpoint, 'above')
  }

  public bulmaBreakpoint$(
    breakpoint: BulmaBreakpointKey,
    dir: 'above'|'below',
  ): Observable<boolean> {
    return this.width$.pipe(
      map((width) => dir === 'above'
        ? width >= BulmaBreakpoint[breakpoint + 'Max']
        : width < BulmaBreakpoint[breakpoint + 'Min']
      )
    )
  }

  public bulmaBreakpointBelow$(
    breakpoint: BulmaBreakpointKey
  ): Observable<boolean> {
    return this.bulmaBreakpoint$(breakpoint, 'below')
  }

  public bulmaBreakpointAbove$(
    breakpoint: BulmaBreakpointKey
  ): Observable<boolean> {
    return this.bulmaBreakpoint$(breakpoint, 'above')
  }
}
