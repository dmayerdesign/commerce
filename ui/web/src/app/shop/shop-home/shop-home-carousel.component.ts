import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, Output, ViewEncapsulation } from '@angular/core'
import { animateTo, forLifeOf, Animation, MortalityAware } from '@qb/common/domains/ui-component/ui-component.helpers'
import { styles } from '@qb/generated/ui/style-variables.generated'
import { Expo } from 'gsap'
import { fromEvent, timer, Subject } from 'rxjs'
import { delay, filter, map, scan, switchMap, takeUntil, tap } from 'rxjs/operators'
import { Carousel, Hero } from './shop-home-carousel'

interface Changes {
  oldValue: number
  newValue: number
}

export abstract class AnimationProgressEvent {
  public abstract progress: 'start' | 'end'
  constructor(
    public toState: 'carousel-in-view' | 'carousel-out-of-view'
  ) { }
}

export class AnimationStartEvent extends AnimationProgressEvent {
  public progress = 'start' as 'start'
}

export class AnimationEndEvent extends AnimationProgressEvent {
  public progress = 'end' as 'end'
}

function getScrollTop(): number {
  const doc = document.documentElement as HTMLElement
  return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
}

@MortalityAware()
@Component({
  selector: 'shop-home-carousel',
  template: `
    <div class="slider-container">
      <ul class="slider">
        <ng-container *ngFor="let hero of heroes; let i = index">
          <li [attr.data-target]="i + 1" class="slide slide--{{ i + 1 }}">
            <div class="slide-text-wrapper slide--{{ i + 1 }}-text-wrapper">
              <section class="hero qb-jumbo"
                [ngStyle]="{
                  height: hero.height,
                  backgroundImage: 'url(' + (hero.image) + ')',
                  backgroundPosition: (hero.imagePositionX) + ' ' + (hero.imagePositionY),
                  backgroundSize: '120rem auto'
                }">
                <div class="hero-body">
                  <div class="container">
                    <div class="hero-body-text"
                      [ngStyle]="{
                        maxWidth: hero.textMaxWidth
                      }">
                      <h1 class="title has-text-white"
                        [ngStyle]="{
                          display: 'inline',
                          textShadow: '0 0.1rem 1rem rgba(0,0,0,0.4)'
                        }">{{ hero.title }}</h1>
                      <h2 *ngIf="hero.subTitle"
                        class="subtitle"
                        [ngStyle]="{
                          marginTop: '2rem',
                          marginBottom: '0.5rem',
                          fontWeight: 'bold',
                          textShadow: '0 0.1rem 1rem rgba(0,0,0,0.4)'
                        }">
                        {{ hero.subTitle }}
                      </h2>
                      <br>
                      <button class="button qb-button-focus-animation-1"
                        [ngStyle]="{
                          fontSize: '0.9rem',
                          marginTop: '2.55rem',
                          padding: '1rem 5rem',
                          height: '4.2rem',
                          borderRadius: '0',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.58rem'
                        }">
                        <span class="button-content">
                          {{ hero.callToAction }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </li>
        </ng-container>
      </ul>

      <ul class="nav">
        <ng-container *ngFor="let hero of heroes; let i = index">
          <li [attr.data-target]="i + 1" class="nav-slide nav-slide--{{ i + 1 }}">
            <ng-container [ngTemplateOutlet]="hero.templateRef"></ng-container>
          </li>
        </ng-container>
      </ul>

      <div [attr.data-target]="'right'" class="side-nav side-nav--right"></div>
      <div [attr.data-target]="'left'" class="side-nav side-nav--left"></div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './shop-home-carousel.component.scss' ],
  providers: [ Carousel ]
})
export class ShopHomeCarouselComponent implements AfterViewInit, OnDestroy {
  @Input() public heroes: Hero[]
  @Input() public interval: Hero[]
  @Input() public feauxScroll = true
  @Output() public animationStart = new EventEmitter<AnimationStartEvent>()
  @Output() public animationEnd = new EventEmitter<AnimationEndEvent>()

  private _isFullyInView = true
  private _isFullyOutOfView = true

  constructor(
    public ngZone: NgZone,
    public carousel: Carousel,
  ) { }

  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.carousel.init(this.heroes)
      this._maybeInitFeauxScroll()
    })
  }

  private _maybeInitFeauxScroll(): void {
    if (this.feauxScroll) {
      let currentBodyMarginAnimation: Animation
      const cancelCurrentAnimation$ = new Subject<void>()

      // Scroll down.
      fromEvent(document, 'scroll')
        .pipe(
          filter(() => this._isFullyInView),
          map(() => getScrollTop()),
          scan<number, Changes>((changes: Changes, currentPos) => {
            return {
              oldValue: changes.newValue,
              newValue: currentPos,
            }
          }, { oldValue: getScrollTop(), newValue: getScrollTop() }),
          filter(({ oldValue, newValue }) => {
            return oldValue - newValue < 0
          }),
          switchMap(() => {
            this._isFullyInView = false
            this._isFullyOutOfView = false
            document.body.style.height = '100vh'
            document.body.style.overflowY = 'hidden'
            // TODO: implement more Rx-y way.
            if (currentBodyMarginAnimation) {
              currentBodyMarginAnimation.stop()
              cancelCurrentAnimation$.next()
            }
            const _timer = timer(1000).pipe(takeUntil(cancelCurrentAnimation$))

            currentBodyMarginAnimation = animateTo({
              element: document.body,
              durationMs: 1000,
              gsapEasingFn: Expo.easeOut,
              toCss: {
                marginTop: `${-((window.innerHeight / parseFloat(
                  getComputedStyle(document.getElementsByTagName('html')[0]).fontSize as string
                )))}${styles.navbarHeight.unit}`
              }
            })

            this.animationStart.emit(new AnimationStartEvent('carousel-out-of-view'))
            return _timer
          }),
          tap(() => {
            document.body.style.height = 'auto'
            document.body.style.overflowY = 'scroll'
          }),
          delay(1),
          tap(() => window.scrollTo(0, 2)),
          delay(1),
          forLifeOf(this),
        )
        .subscribe(() => {
          this._isFullyInView = false
          this._isFullyOutOfView = true
          this.animationEnd.emit(new AnimationEndEvent('carousel-out-of-view'))
        })

      // Scroll up.
      fromEvent(document, 'scroll')
        .pipe(
          filter(() => this._isFullyOutOfView && getScrollTop() < 10),
          map(() => getScrollTop()),
          scan<number, Changes>((changes: Changes, currentPos) => {
            return {
              oldValue: changes.newValue,
              newValue: currentPos,
            }
          }, { oldValue: getScrollTop(), newValue: getScrollTop() }),
          filter(({ oldValue, newValue }) => {
            return oldValue - newValue > 0
          }),
          switchMap(() => {
            this._isFullyOutOfView = false
            window.scrollTo(0, 2)
            document.body.style.height = 'auto'
            document.body.style.overflowY = 'scroll'
            // TODO: implement more Rx-y way.
            if (currentBodyMarginAnimation) {
              currentBodyMarginAnimation.stop()
              cancelCurrentAnimation$.next()
            }
            const _timer = timer(1000).pipe(takeUntil(cancelCurrentAnimation$))

            currentBodyMarginAnimation = animateTo({
              element: document.body,
              durationMs: 1000,
              gsapEasingFn: Expo.easeOut,
              toCss: {
                marginTop: '0'
              }
            })

            this.animationStart.emit(new AnimationStartEvent('carousel-in-view'))
            return _timer
          }),
          forLifeOf(this),
          delay(1),
        )
        .subscribe(() => {
          this._isFullyInView = true
          this.animationEnd.emit(new AnimationEndEvent('carousel-in-view'))
        })
    }
  }

  public ngOnDestroy(): void {
    this.carousel.destroy()
  }
}
