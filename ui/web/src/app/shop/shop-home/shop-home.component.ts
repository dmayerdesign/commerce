import { Component, OnInit } from '@angular/core'
import { styles } from '@qb/generated/ui/style-variables.generated'
import { BehaviorSubject } from 'rxjs'

interface Hero {
  title: string
  callToAction: string
  subTitle?: string
  image?: string
  height?: string
  imagePositionX?: string
  imagePositionY?: string
  bodyPositionX?: string
  bodyPositionY?: string
  bodyMaxWidth?: string
}

@Component({
  selector: 'web-shop-home',
  template: `
    <shop-home-carousel class="hero-carousel">
      <ng-container *ngFor="let hero of heroes$ | async">
        <section *carouselItem
          class="hero qb-jumbo"
          [ngStyle]="{
            height: hero.height,
            backgroundImage: 'url(' + (hero.image) + ')',
            backgroundPosition: (hero.imagePositionX) + ' ' + (hero.imagePositionY),
            backgroundSize: '120rem auto'
          }">
          <div class="hero-body">
            <div class="container"
              [style.position]="'relative'">
              <div class="hero-body-text"
                [ngStyle]="{
                  transform: 'translate(' +
                    (hero.textPositionX) + ', ' +
                    (hero.textPositionY) +
                  ')',
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
      </ng-container>
    </shop-home-carousel>
  `,
  styleUrls: ['./shop-home.component.scss']
})
export class ShopHomeComponent implements OnInit {
  public heroes$ = new BehaviorSubject<Hero[]>([
    {
      title: 'Shop Hot Summer Styles.',
      callToAction: 'Shop Now',
      image: 'https://images.pexels.com/photos/1710795/pexels-photo-1710795.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      height: '100vh',
      imagePositionX: '50%',
      imagePositionY: '-52rem',
      bodyPositionX: '0',
      bodyPositionY: '4rem',
      bodyMaxWidth: '100%',
    },
    {
      title: 'Shop Hot Summer Styles.',
      callToAction: 'Shop Now',
      image: 'https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      height: '100vh',
      imagePositionX: '50%',
      imagePositionY: '0',
      bodyPositionX: '0',
      bodyPositionY: '4rem',
      bodyMaxWidth: '100%',
    },
  ])

  public colorWhite = styles['$white'].value.hex
  public colorAccent = styles['$color-accent'].value.hex

  public ngOnInit(): void {
  }
}
