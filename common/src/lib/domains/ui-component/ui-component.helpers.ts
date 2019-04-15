import * as BezierEasing from 'bezier-easing'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

export function MortalityAware(): ClassDecorator {
  return (target: any) => {
    if (!target.prototype.qb__onDestroy$) {
      const originalOnDestroy = typeof target.prototype.ngOnDestroy === 'function'
        ? target.prototype.ngOnDestroy.bind(target)
        : null

      target.prototype.qb__onDestroy$ = new Subject<true>()

      target.prototype.ngOnDestroy = function(): void {
        if (originalOnDestroy) {
          originalOnDestroy()
        }
        target.prototype.qb__onDestroy$.next(true)
      }
    }
  }
}

export const forLifeOf = <ValueType>(instance: any) => {
  // Check to make sure the class is a component class.
  // http://prideparrot.com/blog/archive/2018/7/extending_component_decorator_angular_6
  // Check to make sure the class has the @MortalityAwareComponent decorator.
  const isMortalityAware = !!instance.qb__onDestroy$

  if (!isMortalityAware) {
    throw new Error(`Tried to use forLifeOf inside ${instance.constructor.name}, which is not a @MortalityAwareComponent.`)
  }
  return takeUntil<ValueType>(instance.qb__onDestroy$)
}

// https://javascript.info/js-animation
export interface AnimateOptions {
  easing: (timeFraction: number) => number
  draw: (progress: number) => void
  duration: number
}

export function animateElement(
  element: HTMLElement,
  styleProperty: string,
  stylePropertyUnit: string,
  fromPx: number,
  toPx: number,
  durationMs: number,
  cubicBezierArgs: [number, number, number, number],
): Animation {
  const easing = BezierEasing(...cubicBezierArgs)
  const fromToDelta = toPx - fromPx
  const getValueFromProgress = (progress: number) => fromPx + (fromToDelta * progress)
  const draw = (progress: number) => {
    element.style[styleProperty] = getValueFromProgress(progress) + stylePropertyUnit
  }
  return animate({ easing, draw, duration: durationMs })
}

export function animate(options: AnimateOptions): Animation {
  const animation = new Animation(options)
  animation.start()
  return animation
}

export class Animation {
  private _canAnimate: boolean

  constructor (
    private _animateOptions: AnimateOptions
  ) { }

  public start(): void {
    console.log('start')
    const { easing, draw, duration } = this._animateOptions
    const start = (performance && performance.now) ? performance.now() : Date.now()
    this._canAnimate = true
    const _animate = (time: number): void => {
      // timeFraction goes from 0 to 1
      let timeFraction = (time - start) / duration
      if (timeFraction > 1) timeFraction = 1

      draw(easing(timeFraction))

      if (timeFraction < 1 && this._canAnimate) {
        requestAnimationFrame(_animate)
      }
    }
    requestAnimationFrame(_animate)
  }

  public stop(): void {
    console.log('stop')
    this._canAnimate = false
  }
}
