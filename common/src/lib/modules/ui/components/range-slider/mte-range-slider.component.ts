import { forwardRef, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { cloneDeep } from 'lodash'
import { fromEvent, merge, BehaviorSubject, Observable } from 'rxjs'
import { delay, filter, map, scan } from 'rxjs/operators'
import { RangeLimit } from '../../../../../constants/enums/range-limit'
import { HeartbeatComponent } from '../../../../heartbeat/heartbeat.component'
import { Heartbeat } from '../../../../heartbeat/heartbeat.decorator'

@Component({
    selector: 'mte-range-slider',
    template: `
        <div class="range-slider-container">
            <div class="range-slider-inputs">
                <input #min
                    class="range-slider-input"
                    data-min
                    type="number"
                    [min]="getMinMin()"
                    [max]="getMinMax()"
                    [step]="displayStep"
                    [ngModel]="value[rangeLimit.Min]"
                    (change)="handleInputChange($event.target)"
                    (input)="handleInputChange($event.target)"
                />
                <input #max
                    class="range-slider-input"
                    data-max
                    type="number"
                    [min]="getMaxMin()"
                    [max]="getMaxMax()"
                    [step]="displayStep"
                    [ngModel]="value[rangeLimit.Max]"
                    (change)="handleInputChange($event.target)"
                    (input)="handleInputChange($event.target)"
                />
            </div>

            <div #track
                class="range-slider-track"
                [ngStyle]="{
                    backgroundColor: trackColor
                }">
            </div>

            <div #slider
                class="range-slider-knobs">

                <div #knobMin
                    data-knob-min
                    class="range-slider-knob range-slider-knob-min"
                    [ngStyle]="{
                        left: (minXPositions | async) + 'px',
                        backgroundColor: knobInnerColor,
                        borderColor: knobColor
                    }">
                    <div *ngIf="isMouseDownOnMin"
                        class="range-slider-knob-clicked">
                    </div>
                </div>

                <div #knobMax
                    data-knob-max
                    class="range-slider-knob range-slider-knob-max"
                    [ngStyle]="{
                        left: (maxXPositions | async) + 'px',
                        backgroundColor: knobInnerColor,
                        borderColor: knobColor
                    }">
                    <div *ngIf="isMouseDownOnMax"
                        class="range-slider-knob-clicked">
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: [ './mte-range-slider.component.scss' ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MteRangeSliderComponent),
            multi: true,
        },
    ],
})
@Heartbeat()
export class MteRangeSliderComponent extends HeartbeatComponent implements ControlValueAccessor, AfterViewInit, OnInit, OnDestroy {
    @Input() public step = 5
    @Input() public decimalPlaces: number
    @Input() public minLimit = 0
    @Input() public maxLimit = 100
    @Input() public knobColor = '#000'
    @Input() public knobInnerColor = '#fff'
    @Input() public trackColor = '#eee'
    @Output() public mouseUp = new EventEmitter<void>()
    @ViewChild('min') public min: ElementRef
    @ViewChild('max') public max: ElementRef
    @ViewChild('slider') public slider: ElementRef
    @ViewChild('knobMin') public knobMin: ElementRef
    @ViewChild('knobMax') public knobMax: ElementRef
    @ViewChild('knobMinDragging') public knobMinDragging: ElementRef
    @ViewChild('knobMaxDragging') public knobMaxDragging: ElementRef
    @ViewChild('track') public track: ElementRef
    public minXPositions: Observable<number>
    public maxXPositions: Observable<number>
    public isMouseDownOnMin = false
    public isMouseDownOnMax = false
    public rangeLimit = RangeLimit
    private _onChange: (value: any) => void
    private _value: number[] = null
    private _lastMouseDownOffset: number
    private _modelChanges = new BehaviorSubject<number[]>(this.value)
    private _viewChanges = new BehaviorSubject<number[]>(this.value)

    constructor(
        private _renderer: Renderer2
    ) { super() }

    public ngOnInit(): void {
        this._value = [ this.getMinLimit(), this.getMaxLimit() ]
        this.minXPositions = merge(
            fromEvent(document, 'mousemove').pipe(
                filter(() => this.isMouseDownOnMin),
                map((event: MouseEvent) => {
                    const mouseOffset = this._lastMouseDownOffset - this.slider.nativeElement.offsetLeft
                    const offsetPx = mouseOffset
                    return event.clientX - offsetPx - this.slider.nativeElement.offsetLeft
                }),
                scan((accumulator, currentPosition) => {
                    const allowedValues = this._getAllowedValues()
                    const value = this._getLimitFromPosition(currentPosition)
                    const allowedValue = allowedValues.find((val) => value < val + 5 && value > val - 5)
                    if (allowedValue > this.value[RangeLimit.Max]) {
                        return accumulator
                    }
                    const newPosition = this._getPositionFromLimit(allowedValue)
                    if (allowedValue != null) {
                        accumulator = newPosition
                    }
                    return accumulator
                }),
            ),
            this._modelChanges.pipe(
                filter((value) => !!value),
                map((value) => this._getPositionFromLimit(value[RangeLimit.Min])),
            ),
        )

        this.maxXPositions = merge(
            fromEvent(document, 'mousemove').pipe(
                filter(() => this.isMouseDownOnMax),
                map((event: MouseEvent) => {
                    const mouseOffset = this._lastMouseDownOffset - this.slider.nativeElement.offsetLeft
                    const offsetPx = mouseOffset
                    return event.clientX - offsetPx - this.slider.nativeElement.offsetLeft
                }),
                scan((accumulator, currentPosition) => {
                    const allowedValues = this._getAllowedValues()
                    const value = this._getLimitFromPosition(currentPosition)
                    const allowedValue = allowedValues.find((val) => value < val + 5 && value > val - 5)
                    if (allowedValue < this.value[RangeLimit.Min]) {
                        return accumulator
                    }
                    const newPosition = this._getPositionFromLimit(allowedValue)
                    if (allowedValue != null) {
                        accumulator = newPosition
                    }
                    return accumulator
                }),
            ),
            this._modelChanges.pipe(
                filter((value) => !!value),
                map((value) => this._getPositionFromLimit(value[RangeLimit.Max])),
            ),
        )

        merge(
            this.minXPositions.pipe(map((minXPos) => this._getLimitFromPosition(minXPos))),
            this._modelChanges.pipe(
                filter((value) => !!value),
                map((value) => value[RangeLimit.Min]),
            ),
        )
            .pipe(delay(0))
            .subscribe((value) => {
                const newValue = [ ...this.value ]
                newValue[RangeLimit.Min] = value
                this.handleViewUpdate(newValue)
            })

        merge(
            this.maxXPositions.pipe(map((maxXPos) => this._getLimitFromPosition(maxXPos))),
            this._modelChanges.pipe(
                filter((value) => !!value),
                map((value) => value[RangeLimit.Max])
            ),
        )
            .pipe(delay(0))
            .subscribe((value) => {
                const newValue = [ ...this.value ]
                newValue[RangeLimit.Max] = value
                this.handleViewUpdate(newValue)
            })
    }

    public ngOnDestroy(): void { }

    public ngAfterViewInit(): void {
        fromEvent<MouseEvent>(document, 'mousedown')
            .subscribe((event) => this._handleMouseDown(event))
        fromEvent<MouseEvent>(document, 'mouseup')
            .subscribe(() => this._handleMouseUp())
    }

    public get value(): number[] {
        return this._value
    }

    public get sliderWidth(): number {
        if (this.slider && this.slider.nativeElement) {
            return this.slider.nativeElement.offsetWidth
        }
        return 0
    }

    public get displayStep(): number {
        if (this.decimalPlaces != null) {
            return Math.pow(10, -this.decimalPlaces)
        }
        return this.step
    }

    public getMinLimit(): number {
        if (this.minLimit % this.step) {
            return this.minLimit - (this.minLimit % this.step)
        }
        return this.minLimit
    }
    public getMaxLimit(): number {
        if (this.maxLimit % this.step) {
            return this.maxLimit + this.step - (this.maxLimit % this.step)
        }
        return this.maxLimit
    }
    public getMinMin(): number {
        return this.getMinLimit()
    }
    public getMinMax(): number {
        return Math.min(this.getMaxLimit(), this.value[RangeLimit.Max])
    }
    public getMaxMin(): number {
        return Math.max(this.getMinLimit(), this.value[RangeLimit.Min])
    }
    public getMaxMax(): number {
        return this.getMaxLimit()
    }

    // view -> model
    @HostListener('change', [ '$event.target' ])
    @HostListener('input', [ '$event.target' ])
    public handleInputChange(inputElement: any): void {
        const newValue = cloneDeep(this._value)
        const indexOfRangeLimit = inputElement.hasAttribute('data-min') ? RangeLimit.Min
            : inputElement.hasAttribute('data-max') ? RangeLimit.Max
            : null
        const inputValue = Array.isArray(inputElement.value)
            ? inputElement.value[indexOfRangeLimit]
            : inputElement.value

        newValue[indexOfRangeLimit] = parseFloat(inputValue)
        if (newValue[RangeLimit.Min] <= newValue[RangeLimit.Max]) {
            this.handleViewUpdate(newValue)

            if (inputElement.hasAttribute('data-min')) {
                this.knobMin.nativeElement.style.left = `${this._getPositionFromLimit(newValue[RangeLimit.Min])}px`
            }
            if (inputElement.hasAttribute('data-max')) {
                this.knobMax.nativeElement.style.left = `${this._getPositionFromLimit(newValue[RangeLimit.Max])}px`
            }
        }
    }

    public handleViewUpdate(newValue: number[]): void {
        if (newValue[RangeLimit.Min] <= newValue[RangeLimit.Max]) {
            newValue = [
                Math.floor(newValue[RangeLimit.Min]),
                Math.ceil(newValue[RangeLimit.Max]),
            ]
            this._value = newValue
            this._onChange(this.value)
            this._viewChanges.next(this.value)
        }
    }

    // model -> view
    public writeValue(value: number[]): void {
        let min: number
        let max: number

        if (!!value && !Array.isArray(value)) {
            console.warn('Attempted to write a non-array value to the range slider.')
            return
        }
        else if (!!value && value.length > 2) {
            console.warn('The value supplied to the range slider was an array with more than 2 elements.')
        }
        else if (value && value.length < 2) {
            min = value[RangeLimit.Min]
            max = this.getMaxLimit()
        }
        else if (!value) {
            min = this.getMinLimit()
            max = this.getMaxLimit()
        }
        else {
            min = value[RangeLimit.Min]
            max = value[RangeLimit.Max]
        }

        if (typeof min !== 'number') {
            if (min === '') {
                min = 0
            }
            else {
                min = parseFloat(min)
                if (isNaN(min)) {
                    throw new Error('The range minimum could not be parsed as a number.')
                }
            }
        }
        if (typeof max !== 'number') {
            if (max === '') {
                max = 0
            }
            else {
                max = parseFloat(max)
                if (isNaN(max)) {
                    throw new Error('The range maximum could not be parsed as a number.')
                }
            }
        }

        if (min % this.step) {
            min = min - (min % this.step)
            if (min < 0) min = 0
        }

        if (max % this.step) {
            max = max - (max % this.step) + this.step
            if (max < 0) max = 0
        }

        if (min <= max) {
            this._value = [
                Math.floor(min),
                Math.ceil(max),
            ]
            this._renderer.setValue(this.min.nativeElement, `${min}`)
            this._renderer.setValue(this.max.nativeElement, `${max}`)
            this._modelChanges.next(this.value)
        }
    }

    private _handleMouseDown(event: MouseEvent): void {
        const knob = this._findNearestElementWithAttribute(event.target, 'data-knob-min')
            || this._findNearestElementWithAttribute(event.target, 'data-knob-max')

        if (knob) {
            this._lastMouseDownOffset = event.clientX - knob.offsetLeft
            if (knob.hasAttribute('data-knob-min')) {
                this.isMouseDownOnMin = true
            }
            else if (knob.hasAttribute('data-knob-max')) {
                this.isMouseDownOnMax = true
            }
        }
    }

    private _handleMouseUp(): void {
        if (this.isMouseDownOnMin || this.isMouseDownOnMax) {
            this.mouseUp.emit()
        }
        this.isMouseDownOnMin = false
        this.isMouseDownOnMax = false
    }

    private _getLimitFromPosition(position: number): number {
        let limit = 0
        if (this.sliderWidth) {
            const fraction = position / this.sliderWidth
            limit = this.getMinLimit() + ((this.getMaxLimit() - this.getMinLimit()) * fraction)
        }
        return limit
    }

    private _getPositionFromLimit(limit: number): number {
        let position = 0
        if (limit < this.getMinLimit()) {
            return this.getMinLimit()
        }
        if (limit > this.getMaxLimit()) {
            return this.getMaxLimit()
        }
        if (this.sliderWidth) {
            const fraction = (limit - this.getMinLimit()) / (this.getMaxLimit() - this.getMinLimit())
            position = this.sliderWidth * fraction
        }
        return position
    }

    private _getAllowedValues(): number[] {
        const self = this
        return Array.from(
            (function*() {
                for (let x = self.getMinLimit(); x <= self.getMaxLimit(); x++) {
                    if (x % self.step === 0) {
                        yield x
                    }
                }
            }())
        )
    }

    public registerOnChange(onChangeFn: (value: any) => void): void {
        this._onChange = onChangeFn
    }
    public registerOnTouched(_onTouchedFn: any): void { }

    private _findNearestElementWithAttribute(element: any, attribute: string): any {
        let i = 0
        const _findNearestElementWithAttribute = (_element: any, _attribute: string) => {
            i++
            if (i < 5) {
                if (_element.hasAttribute(_attribute)) {
                    return _element
                } else if (!!_element.parentElement) {
                    return this._findNearestElementWithAttribute(_element.parentElement, _attribute)
                } else {
                    return null
                }
            }
            return null
        }
        return _findNearestElementWithAttribute(element, attribute)
    }
}
