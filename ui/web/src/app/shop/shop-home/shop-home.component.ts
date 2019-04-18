import { Component, ElementRef, ViewChild, OnInit } from '@angular/core'
import { styles } from '@qb/generated/ui/style-variables.generated'
import { BehaviorSubject } from 'rxjs'
import { Hero } from './shop-home-carousel'
import { ShopStore } from '../shop.store';

@Component({
  selector: 'web-shop-home',
  template: `
    <div #shopHomeAbove class='shop-home-above'>
      <shop-home-carousel class='hero-carousel'
        [heroes]='heroes$ | async'
        [interval]='10000'>
      </shop-home-carousel>
    </div>
    <div #shopHomeBelow class='shop-home-below'>
      <div [ngStyle]="{ height: '1500px', background: 'white' }"></div>
    </div>
  `,
})
export class ShopHomeComponent implements OnInit {
  @ViewChild('shopHomeBelow') public shopHomeBelow: ElementRef
  @ViewChild('shopHomeAbove') public shopHomeAbove: ElementRef

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
      title: 'Bundle Up.',
      callToAction: 'Shop Now',
      image: 'https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      height: '100vh',
      imagePositionX: '50%',
      imagePositionY: '0',
      bodyPositionX: '0',
      bodyPositionY: '4rem',
      bodyMaxWidth: '100%',
    },
    {
      title: 'Fall In Love.',
      callToAction: 'Shop Now',
      image: 'https://images.pexels.com/photos/2067659/pexels-photo-2067659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      height: '100vh',
      imagePositionX: '50%',
      imagePositionY: '0',
      bodyPositionX: '0',
      bodyPositionY: '4rem',
      bodyMaxWidth: '100%',
    },
  ])

  public colorWhite = styles.white.value.hex
  public colorAccent = styles.colorAccent.value.hex

  constructor(
    private _shopStore: ShopStore
  ) { }

  public ngOnInit(): void {
    this._shopStore.setState({ isHomeCarouselVisible: true })
  }
}
