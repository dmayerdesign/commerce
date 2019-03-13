// Credit to [@NetanelBasal](https://stackblitz.com/@NetanelBasal)
import { animate, style, AnimationBuilder, AnimationFactory } from '@angular/animations'
import { AfterViewInit, Component, ContentChildren, Directive, ElementRef, Input,
  OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core'
import { HeartbeatComponent } from '@qb/common/heartbeat/heartbeat.component'
import { Heartbeat } from '@qb/common/heartbeat/heartbeat.decorator'
import { WindowRefService } from '@qb/common/modules/ui/services/window-ref.service'
import { interval, merge } from 'rxjs'
import { shareReplay, takeWhile } from 'rxjs/operators'

@Directive({
  selector: '[carouselItem]'
})
export class ShopHomeCarouselItemDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

@Component({
  selector: 'shop-home-carousel',
  template: `
    <section class="carousel-wrapper"
      [ngStyle]="{
        height: isVertical ? itemLengthPx + 'px' : 'auto',
        width: isVertical ? 'auto' : itemLengthPx + 'px'
      }">
      <ul #carousel
        class="carousel-inner"
        [ngStyle]="{
          height: isVertical ? totalLengthPx + 'px' : 'auto',
          width: isVertical ? 'auto' : totalLengthPx + 'px'
        }">
        <ng-container *ngFor="let item of items">
          <li #carouselItem class="carousel-item">
            <ng-container [ngTemplateOutlet]="item.templateRef"></ng-container>
          </li>
        </ng-container>
      </ul>
    </section>
    <div *ngIf="showControls" style="margin-top: 1em">
      <button (click)="next()" class="btn btn-default">Next</button>
      <button (click)="prev()" class="btn btn-default">Prev</button>
    </div>
  `,
  styles: [`
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .carousel-wrapper {
      overflow: hidden;
    }
  `]
})
@Heartbeat()
export class ShopHomeCarouselComponent extends HeartbeatComponent
  implements AfterViewInit, OnDestroy, OnInit {

  @ContentChildren(ShopHomeCarouselItemDirective)
    public items: QueryList<ShopHomeCarouselItemDirective>
  @ViewChildren('carouselItem', { read: ElementRef })
    public itemsElements: QueryList<ElementRef>
  @ViewChild('carousel') public carousel: ElementRef
  @Input() public timing = '250ms ease-in'
  @Input() public showControls = true
  @Input() public direction: 'vertical'|'horizontal' = 'vertical'

  public totalLengthPx: number
  public itemLengthPx: number
  public currentSlideIndex = 0

  public get isVertical(): boolean {
    return this.direction === 'vertical'
  }

  constructor(
    private _animationBuilder: AnimationBuilder,
    private _windowRefService: WindowRefService,
  ) { super() }

  public ngOnInit(): void { }

  public ngAfterViewInit(): void {
    const dimensionsChange$ = merge(
      this._windowRefService.widths.pipe(shareReplay()),
      this._windowRefService.heights.pipe(shareReplay()),
    )

    setTimeout(() => {
      dimensionsChange$.subscribe(() => {
        this.itemLengthPx = this.isVertical
          ? this.itemsElements.first.nativeElement.getBoundingClientRect().height
          : this.itemsElements.first.nativeElement.getBoundingClientRect().width
        this.totalLengthPx = this.itemLengthPx * this.itemsElements.length
        this.recalibrate()
      })
    })

    interval(4000).pipe(takeWhile(() => this.isAlive))
      .subscribe(
        () => this.next(),
        () => { },
      )
  }

  public ngOnDestroy(): void { }

  public recalibrate(): void {
    this._createAndPlayAnimation()
  }

  public next(): void {
    if (this.currentSlideIndex + 1 === this.items.length) {
      this.currentSlideIndex = 0
    }
    else {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.items.length
    }
    this._createAndPlayAnimation()
  }

  public prev(): void {
    if (this.currentSlideIndex === 0) {
      this.currentSlideIndex = this.items.length - 1
    }
    else {
      this.currentSlideIndex = ((this.currentSlideIndex - 1) + this.items.length) % this.items.length
    }
    this._createAndPlayAnimation()
  }

  private _createAndPlayAnimation(): void {
    const thisPartialSnapshot = {
      itemLengthPx: this.itemLengthPx,
      currentSlideIndex: this.currentSlideIndex,
      isVertical: this.isVertical,
    }
    return this._buildAnimation(thisPartialSnapshot as any)
      .create(this.carousel.nativeElement)
      .play()
  }

  private _buildAnimation(snapshot: Partial<this>): AnimationFactory {
    const offset = `${this._getOffsetPx(snapshot)}px`
    const translateFn = snapshot.isVertical ? 'translateY' : 'translateX'
    return this._animationBuilder.build([
      style({  }),
      animate(this.timing, style({ transform: `${translateFn}(-${offset})` })),
    ])
  }

  private _getOffsetPx(snapshot: Partial<this>): number {
    return (snapshot.currentSlideIndex as number) * (snapshot.itemLengthPx as number)
  }
}
