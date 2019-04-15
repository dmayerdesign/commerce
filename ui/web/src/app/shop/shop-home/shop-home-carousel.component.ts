import { AfterViewInit, Component, Input, NgZone, OnDestroy, ViewEncapsulation } from '@angular/core'
import { animateElement, forLifeOf, Animation, MortalityAware } from '@qb/common/domains/ui-component/ui-component.helpers'
import { styles } from '@qb/generated/ui/style-variables.generated'
import { fromEvent, timer, Subject } from 'rxjs'
import { debounceTime, delay, filter, map, scan, switchMap, takeUntil, tap } from 'rxjs/operators'
import { Carousel, Hero } from './shop-home-carousel'

interface Changes {
  oldValue: number
  newValue: number
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
            <!-- div class="slide-darkbg slide--{{ i + 1 }}-darkbg"></div -->
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
                          marginRight: '1rem',
                          textShadow: '0 0.1rem 1rem rgba(0,0,0,0.4)'
                        }">
                        {{ hero.title }}
                      </h1>
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
                      <button class="button"
                        [ngStyle]="{
                          color: colorWhite,
                          backgroundColor: colorAccent,
                          fontSize: '0.9rem',
                          marginTop: '2.55rem',
                          padding: '1rem 5rem',
                          height: '4.2rem',
                          borderRadius: '0',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.58rem'
                        }">
                        {{ hero.callToAction }}
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

  private _isFullyInView = true
  private _isFullyOutOfView = true

  constructor(
    public ngZone: NgZone,
    public carousel: Carousel,
  ) { }

  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.carousel.init(this.heroes)

      let currentBodyMarginAnimation: Animation
      const cancelCurrentAnimation$ = new Subject<void>()

      fromEvent(document, 'scroll')
        .pipe(
          debounceTime(10),
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
            currentBodyMarginAnimation = animateElement(
              document.body, 'marginTop', styles.navbarHeight.unit,
              0, -((window.innerHeight / 10) - styles.navbarHeight.value - styles.aboveNavbarHeight.value),
              1000, [0.2, 0, 0.1, 1],
            )
            return _timer
          }),
          tap(() => {
            document.body.style.height = 'auto'
            document.body.style.overflowY = 'scroll'
          }),
          delay(1),
          tap(() => window.scrollTo(0, 1)),
          delay(1),
          forLifeOf(this),
        )
        .subscribe(() => {
          this._isFullyInView = false
          this._isFullyOutOfView = false
          this._isFullyOutOfView = true
        })

      fromEvent(document, 'scroll')
        .pipe(
          debounceTime(10),
          filter(() => this._isFullyOutOfView && getScrollTop() < 10),
          map(() => getScrollTop()),
          scan<number, Changes>((changes: Changes, currentPos) => {
            return {
              newValue: currentPos,
              oldValue: changes.newValue
            }
          }, { oldValue: getScrollTop(), newValue: getScrollTop() }),
          filter(({ oldValue, newValue }) => {
            return oldValue - newValue > 0
          }),
          switchMap(() => {
            this._isFullyOutOfView = false
            window.scrollTo(0, 0)
            document.body.style.height = 'auto'
            document.body.style.overflowY = 'scroll'
            // TODO: implement more Rx-y way.
            if (currentBodyMarginAnimation) {
              currentBodyMarginAnimation.stop()
              cancelCurrentAnimation$.next()
            }
            const _timer = timer(1000).pipe(takeUntil(cancelCurrentAnimation$))
            currentBodyMarginAnimation = animateElement(
              document.body, 'marginTop', styles.navbarHeight.unit,
              -((window.innerHeight / 10) - styles.navbarHeight.value - styles.aboveNavbarHeight.value), 0,
              1000, [0.2, 0, 0.1, 1],
            )
            return _timer
          }),
          forLifeOf(this),
        )
        .subscribe(() => {
          this._isFullyInView = true
        })
    })
  }

  public ngOnDestroy(): void {
    this.carousel.destroy()
  }
}
