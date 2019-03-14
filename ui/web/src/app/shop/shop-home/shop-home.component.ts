import { Component, OnInit } from '@angular/core'
import { styles } from '@qb/generated/ui/style-variables.generated'
import { BehaviorSubject } from 'rxjs'
import { Hero } from './shop-home-carousel'

@Component({
  selector: 'web-shop-home',
  template: `
    <shop-home-carousel class="hero-carousel"
      [heroes]="heroes$ | async"
      [interval]="10000">
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
