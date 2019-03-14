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

export function initCarousel(arrHeroes: Hero[]): void {
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
  const slideDarkBgs = $slider.querySelectorAll('.slide-darkbg') as NodeListOf<HTMLElement>
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

    console.log(`direction: ${direction}  curSlide: ${curSlide}`)

    $slider.classList.add('animation')
    $slider.style.transform = 'translate3d(-' + ((curSlide - direction) * 100) + '%, 0, 0)'

    slideDarkBgs.forEach((slideDarkBg) => {
      slideDarkBg.style.transform = 'translate3d(' + ((curSlide - direction) * 50) + '%, 0, 0)'
    })

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
    return function(event: MouseEvent): void {
      if (animation) return
      console.log('mouse down', event)
      const target = +(slide.getAttribute('data-target') as string)
      const startX = event.pageX != null
        ? event.pageX
        : (event as any).originalEvent.touches[0].pageX
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
    return function(event: MouseEvent): void {
      console.log('mouse move', event)
      const x = event.pageX != null
        ? event.pageX
        : (event as any).originalEvent.touches[0].pageX
      diff = startX - x
      if (target === 1 && diff < 0 || target === numOfHeroes && diff > 0) return

      $slider.style.transform = 'translate3d(-' + ((curSlide - 1) * 100 + (diff / 30)) + '%, 0, 0)'

      slideDarkBgs.forEach((slideDarkBg) => {
        slideDarkBg.style.transform = 'translate3d(' + ((curSlide - 1) * 50 + (diff / 60)) + '%, 0, 0)'
      })
      slideTexts.forEach((slideText) => {
        slideText.style.transform = 'translate3d(' + (diff / 15) + 'px, 0, 0)'
      })
    }
  }

  document.addEventListener('mouseup', mouseUpHandler)
  document.addEventListener('touchend', mouseUpHandler)
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('mousewheel', scrollHandler)
  document.addEventListener('DOMMouseScroll', scrollHandler)

  function scrollHandler(event: WheelEvent): void {
    if (animation) return
    const delta = (event as any).wheelDelta || 0

    if (delta > 0 || event.detail < 0) navigateLeft()
    if (delta < 0 || event.detail > 0) navigateRight()
  }

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

  const navSlideNotActive = document.querySelector('.nav-slide:not(.nav-active)') as HTMLElement
  const sideNav = document.querySelector('.side-nav') as HTMLElement

  navSlideNotActive.addEventListener('click', (e) => {
    console.log('navSlideNotActive clicked', navSlideNotActive, e)
    const target = +(navSlideNotActive.getAttribute('data-target') as string)
    bullets(target)
    curSlide = target
    pagination(PagingDirection.Default)
  })

  sideNav.addEventListener('click', () => {
    const target = sideNav.getAttribute('data-target')
    if (target === 'right') navigateRight()
    if (target === 'left') navigateLeft()
  })
}
