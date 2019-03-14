import { AfterViewInit, Component, Input, NgZone, ViewEncapsulation } from '@angular/core'
import { initCarousel, Hero } from './shop-home-carousel'

@Component({
  selector: 'shop-home-carousel',
  template: `
    <div class="slider-container">
      <ul class="slider">
        <ng-container *ngFor="let hero of heroes; let i = index">
          <li [attr.data-target]="i + 1" class="slide slide--{{ i + 1 }}">
            <div class="slide-darkbg slide--{{ i + 1 }}-darkbg"></div>
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
})
export class ShopHomeCarouselComponent implements AfterViewInit {
  @Input() public heroes: Hero[]
  @Input() public interval: Hero[]

  constructor(public ngZone: NgZone) { }

  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => initCarousel(this.heroes))
  }
}
