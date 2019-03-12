import { Component, OnInit } from '@angular/core'
import { styles } from '@qb/generated/ui/style-variables.generated'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'

interface Hero {
  title: string
  subTitle: string
  callToAction: string
  image: string
  height: string
  imagePositionX: string
  imagePositionY: string
  bodyPositionX: string
  bodyPositionY: string
  bodyMaxWidth: string
}

@Component({
  selector: 'web-shop-home',
  template: `
    <div class="hero-carousel">
      <section class="hero qb-jumbo"
        [ngStyle]="{
          height: heroHeight$ | async,
          backgroundImage: 'url(' + (heroImage$ | async) + ')',
          backgroundPosition: (heroImagePositionX$ | async) + ' ' + (heroImagePositionY$ | async),
          backgroundSize: '120rem auto'
        }">
        <div class="hero-body">
          <div class="container"
            [style.position]="'relative'">
            <div class="hero-body-text"
              [ngStyle]="{
                transform: 'translate(' +
                  (heroTextPositionX$ | async) + ', ' +
                  (heroTextPositionY$ | async) +
                ')',
                maxWidth: heroTextMaxWidth$ | async
              }">
              <h1 class="title has-text-white"
                [ngStyle]="{
                  display: 'inline',
                  marginRight: '1rem',
                  textShadow: '0 0.1rem 1rem rgba(0,0,0,0.4)'
                }">
                {{ heroTitle$ | async }}
              </h1>
              <h2 *ngIf="heroSubTitle$ | async"
                class="subtitle"
                [ngStyle]="{
                  marginTop: '2rem',
                  marginBottom: '0.5rem',
                  textShadow: '0 0.1rem 0.4rem rgba(0,0,0,0.4)',
                  fontWeight: 'bold'
                }">
                {{ heroSubTitle$ | async }}
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
                {{ heroCallToAction$ | async }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./shop-home.component.scss']
})
export class ShopHomeComponent implements OnInit {
  private _heroes: Hero[] = [
    {
      title: 'Shop Hot Summer Styles.',
      subTitle: 'Some subtitle lorem ipsum. Dolor sit amet consectetur.',
      callToAction: 'Shop Now',
      image: 'https://images.pexels.com/photos/1710795/pexels-photo-1710795.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      // 'https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      height: '100vh',
      imagePositionX: '50%',
      imagePositionY: '-52rem',
      bodyPositionX: '0',
      bodyPositionY: '4rem',
      bodyMaxWidth: '100%',
    },
  ]
  public hero$ = new BehaviorSubject<Hero>(this._heroes[0])
  public heroTitle$ = this.hero$.pipe(map(({ title }) => title))
  public heroSubTitle$ = this.hero$.pipe(map(({ subTitle }) => subTitle))
  public heroHeight$ = this.hero$.pipe(map(({ height }) => height))
  public heroImage$ = this.hero$.pipe(map(({ image }) => image))
  public heroTextPositionX$ = this.hero$.pipe(map(({ bodyPositionX }) => bodyPositionX))
  public heroTextPositionY$ = this.hero$.pipe(map(({ bodyPositionY }) => bodyPositionY))
  public heroImagePositionX$ = this.hero$.pipe(map(({ imagePositionX }) => imagePositionX))
  public heroImagePositionY$ = this.hero$.pipe(map(({ imagePositionY }) => imagePositionY))
  public heroTextMaxWidth$ = this.hero$.pipe(map(({ bodyMaxWidth }) => bodyMaxWidth))
  public heroCallToAction$ = this.hero$.pipe(map(({ callToAction }) => callToAction))

  public colorWhite = styles['$white'].value.hex
  public colorAccent = styles['$color-accent'].value.hex

  public ngOnInit(): void {
    this._setRandomImage()
  }

  private _setRandomImage(): void {
    const randomIndex = Math.floor(Math.random() * this._heroes.length)
    this.hero$.next(this._heroes[randomIndex])
  }

}
