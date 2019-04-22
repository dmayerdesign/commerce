import { Injectable } from '@angular/core'

// Credit to [Ruslan Pivovarov](https://codepen.io/mrspok407)

export interface Hero {
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

const enum PagingDirection {
  Next = 0,
  Default = 1,
  Previous = 2,
}

@Injectable()
export class Carousel {
  private _eventListeners = {
    click: new WeakMap<HTMLElement, EventListenerOrEventListenerObject>()
  }

  public init(arrHeroes: Hero[]): void {
    const $slider = document.querySelector('.slider') as HTMLElement
    const winW = window.innerWidth
    const animSpd = 750 // Change also in CSS
    const distOfLetGo = winW * 0.2
    let curSlide = 1
    let animation = false
    const autoScrollVar = true
    let diff = 0
    const numOfHeroes = arrHeroes.length

    let mouseMoveHandler: (event: MouseEvent) => void
    let touchMoveHandler: (event: MouseEvent) => void

    const slides = document.querySelectorAll('.slide') as NodeListOf<HTMLElement>
    const firstSlideNav = document.querySelector('.nav-slide--1') as HTMLElement
    const slideTexts = $slider.querySelectorAll('.slide-text') as NodeListOf<HTMLElement>

    // Navigation
    firstSlideNav.classList.add('nav-active')
    function bullets(dir: number): void {
      (document.querySelector('.nav-slide--' + curSlide) as HTMLElement).classList.remove('nav-active');
      (document.querySelector('.nav-slide--' + dir) as HTMLElement).classList.add('nav-active')
    }

    function timeout(): void {
      animation = false
    }

    function pagination(direction: PagingDirection): void {
      animation = true
      diff = 0

      $slider.classList.add('animation')
      $slider.style.transform = 'translate3d(-' + ((curSlide - direction) * 100) + '%, 0, 0)'

      slideTexts.forEach((slideText) => {
        slideText.style.transform = 'translate3d(0, 0, 0)'
      })
    }

    function navigateRight(): void {
      if (!autoScrollVar) return
      if (curSlide >= numOfHeroes) return
      pagination(PagingDirection.Next)
      setTimeout(timeout, animSpd)
      bullets(curSlide + 1)
      curSlide++
    }

    function navigateLeft(): void {
      if (curSlide <= 1) return
      pagination(PagingDirection.Previous)
      setTimeout(timeout, animSpd)
      bullets(curSlide - 1)
      curSlide--
    }

    function toDefault(): void {
      pagination(PagingDirection.Default)
      setTimeout(timeout, animSpd)
    }

    // Events
    slides.forEach((slide) => {
      const mouseDownHandler = createMouseDownHandler(slide)
      slide.addEventListener('mousedown', mouseDownHandler)
      slide.addEventListener('touchstart', mouseDownHandler)
    })

    function createMouseDownHandler(slide: HTMLElement): (event: MouseEvent) => void {
      return function(event: MouseEvent | TouchEvent): void {
        if (animation) return
        const target = +(slide.getAttribute('data-target') as string)
        const startX = (event as MouseEvent).pageX != null
          ? (event as MouseEvent).pageX
          : (event as any).originalEvent
          ? (event as any).originalEvent.touches[0].pageX
          : (event as TouchEvent).touches[0].pageX
        $slider.classList.remove('animation')

        if (mouseMoveHandler) {
          document.removeEventListener('mousemove', mouseMoveHandler)
        }
        if (touchMoveHandler) {
          document.removeEventListener('touchmove', touchMoveHandler)
        }

        mouseMoveHandler = createMouseMoveHandler(target, startX)
        touchMoveHandler = createMouseMoveHandler(target, startX)
        document.addEventListener('mousemove', mouseMoveHandler)
        document.addEventListener('touchmove', mouseMoveHandler)
      }
    }

    function createMouseMoveHandler(target: number, startX: number): (event: MouseEvent) => void {
      return function(event: MouseEvent | TouchEvent): void {
        const x = (event as MouseEvent).pageX != null
          ? (event as MouseEvent).pageX
          : (event as any).originalEvent
          ? (event as any).originalEvent.touches[0].pageX
          : (event as TouchEvent).touches[0].pageX
        diff = startX - x
        if (target === 1 && diff < 0 || target === numOfHeroes && diff > 0) return

        $slider.style.transform = 'translate3d(-' + ((curSlide - 1) * 100 + (diff / 30)) + '%, 0, 0)'

        slideTexts.forEach((slideText) => {
          slideText.style.transform = 'translate3d(' + (diff / 15) + 'px, 0, 0)'
        })
      }
    }

    document.addEventListener('mouseup', mouseUpHandler)
    document.addEventListener('touchend', mouseUpHandler)
    document.addEventListener('keydown', keyDownHandler)

    function mouseUpHandler(): void {
      if (mouseMoveHandler) {
        document.removeEventListener('mousemove', mouseMoveHandler)
      }
      if (touchMoveHandler) {
        document.removeEventListener('touchmove', touchMoveHandler)
      }

      if (animation) return

      if (diff >= distOfLetGo) {
        navigateRight()
      } else if (diff <= -distOfLetGo) {
        navigateLeft()
      } else {
        toDefault()
      }
    }

    function keyDownHandler({ which }: KeyboardEvent): void {
      if (which === 39) navigateRight()
      if (which === 37) navigateLeft()
    }

    const navSlides = document.querySelectorAll('.nav-slide') as NodeListOf<HTMLElement>
    const sideNavs = document.querySelectorAll('.side-nav') as NodeListOf<HTMLElement>

    navSlides.forEach((navSlide) => {
      const listener = (e) => {
        const target = +(navSlide.getAttribute('data-target') as string)
        bullets(target)
        curSlide = target
        pagination(PagingDirection.Default)
      }
      this._eventListeners.click.set(navSlide, listener)
      navSlide.addEventListener('click', listener)
    })

    sideNavs.forEach((sideNav) => {
      const listener = ({ target: element }) => {
        const target = (element as HTMLElement).getAttribute('data-target')
        if (target === 'right') navigateRight()
        if (target === 'left') navigateLeft()
      }
      this._eventListeners.click.set(sideNav, listener)
      sideNav.addEventListener('click', listener)
    })
  }

  public destroy(): void {
    const sideNavs = document.querySelectorAll('.side-nav') as NodeListOf<HTMLElement>
    const navSlides = document.querySelectorAll('.nav-slide:not(.nav-active)') as NodeListOf<HTMLElement>

    sideNavs.forEach((sideNav) => sideNav.removeEventListener(
      'click',
      this._eventListeners.click.get(sideNav) as EventListenerOrEventListenerObject,
    ))

    navSlides.forEach((navSlide) => navSlide.removeEventListener(
      'click',
      this._eventListeners.click.get(navSlide) as EventListenerOrEventListenerObject,
    ))
  }
}
