import { Component, OnInit } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'

interface Hero {
  image: string
  left: string
  top: string
  bodyMaxWidth: string
}

@Component({
  selector: 'web-shop-home',
  template: `
    <section class="hero is-large"
      [ngStyle]="{
        backgroundImage: 'url(' + (heroBgImage$ | async) + ')',
        backgroundPosition: '50% top',
        backgroundSize: '120rem auto'
      }">
      <div class="hero-body">
        <div class="container"
          [style.position]="'relative'">
          <div class="hero-body-text"
            [ngStyle]="{
              position: 'absolute',
              left: heroTextLeft$ | async,
              top: heroTextTop$ | async,
              maxWidth: heroBodyMaxWidth$ | async
            }">
            <h1 class="title">
              Shop Tagline Here.
            </h1>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./shop-home.component.scss']
})
export class ShopHomeComponent implements OnInit {
  private _heroes: Hero[] = [
    // {
    //   image: 'https://images.pexels.com/photos/1938352/pexels-photo-1938352.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    //   left: '0',
    //   top: '0',
    // },
    {
      image: 'https://images.pexels.com/photos/768943/pexels-photo-768943.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      left: '36%',
      top: '-5rem',
      bodyMaxWidth: '37rem',
    },
  ]
  public hero$ = new BehaviorSubject<Hero>(this._heroes[0])
  public heroBgImage$ = this.hero$.pipe(map(({ image }) => image))
  public heroTextLeft$ = this.hero$.pipe(map(({ left }) => left))
  public heroTextTop$ = this.hero$.pipe(map(({ top }) => top))
  public heroBodyMaxWidth$ = this.hero$.pipe(map(({ bodyMaxWidth }) => bodyMaxWidth))

  public ngOnInit(): void {
    this._setRandomImage()
  }

  private _setRandomImage(): void {
    const randomIndex = Math.floor(Math.random() * this._heroes.length)
    this.hero$.next(this._heroes[randomIndex])
  }

}
