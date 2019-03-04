import {
    AfterContentInit,
    Component,
    ContentChild,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
} from '@angular/core'
import { fromEvent } from 'rxjs'
import { takeWhile } from 'rxjs/operators'

import { FormErrors } from '@qb/common/constants/copy'
import { HeartbeatComponent } from '@qb/common/heartbeat/heartbeat.component'
import { Heartbeat } from '@qb/common/heartbeat/heartbeat.decorator'
import { QbFormFieldOptions } from '../../models/form-field-options'

@Component({
    selector: 'qb-form-field',
    template: `
        <div class="form-group">
            <label *ngIf="options?.label"
                   [ngClass]="getLabelClassName()">
                {{ options.label }}
            </label>

            <div class="{{ options?.formControlType }}-group">
                <ng-content></ng-content>
            </div>

            <span *ngIf="isShowingDefaultMessage"
                  [ngClass]="getErrorMessageClassNameObject()">
                {{ errorMessage }}
            </span>

            <ng-container *ngIf="isShowingCustomErrorMessage">
                <ng-container *ngTemplateOutlet="customErrorMessage"></ng-container>
            </ng-container>
        </div>
    `,
})
@Heartbeat()
export class QbFormFieldComponent extends HeartbeatComponent implements OnInit, OnDestroy, AfterContentInit {
    @Input() public options: QbFormFieldOptions = {
        label: ''
    }
    @Input() public customErrorMessage: TemplateRef<any>
    @ContentChild('input', { read: ElementRef }) public input: ElementRef

    public errorMessage: string | null
    public hasBlurred = false
    public isFocused = false

    public orderOfErrorsDisplayed = [
        'required',
        'email',
        'password',
    ]

    public ngOnInit(): void {
        const { control, errorMessages } = this.options

        if (!errorMessages) {
            this.setErrorMessage()
        }

        if (control) {
            control.statusChanges.pipe(takeWhile(() => this.isAlive))
                .subscribe(() => {
                    this.setErrorMessage()
                })

            if (control.parent) {
                control.parent.statusChanges.pipe(takeWhile(() => this.isAlive))
                    .subscribe(() => {
                        this.setErrorMessage()
                    })
            }
        }
    }

    public ngAfterContentInit(): void {
        const nativeElement = this.input ? this.input.nativeElement : null
        if (!this.input || !nativeElement) {
            throw new Error(`Invalid value provided to @ContentChild: ${this.input}.
One ControlValueAccessor bound to a template local named 'input' must be passed as a \
content child of <qb-form-field>, like so:

    <qb-form-field [options]="{ label: 'Email' }">
        <input #input formControlName="email">
    </qb-form-field>\n`)
        }

        if (!this.options || typeof this.options.formControlType === 'undefined') {
            this.options.formControlType = (function() {
                const firstNativeElement = nativeElement
                const nodeName = firstNativeElement.nodeName.toLowerCase()
                const inputType = firstNativeElement.getAttribute('type')
                if (nodeName === 'select') {
                    return nodeName
                }
                else if (inputType) {
                    if (inputType === 'checkbox') {
                        return 'checkbox'
                    }
                }
                return nodeName as 'input'
            }())
        }

        fromEvent(nativeElement, 'blur')
            .pipe(takeWhile(() => this.isAlive))
            .subscribe(() => {
                this.isFocused = false
                this.hasBlurred = true
            })

        fromEvent(nativeElement, 'focus')
            .pipe(takeWhile(() => this.isAlive))
            .subscribe(() => {
                this.isFocused = true
            })
    }

    public ngOnDestroy(): void { }

    public getLabelClassName(): string {
        const classNames: string[] = []
        if (this.options && !!this.options.labelClass) {
            classNames.push(this.options.labelClass)
        }
        if (this.options && this.options.hideLabel) {
            classNames.push('sr-only')
        }
        return classNames.join(' ')
    }

    public getErrorMessageClassNameObject(): { [key: string]: boolean } {
        return {
            'text-danger': !this.isValid
        }
    }

    public get isValid(): boolean {
        if (this.options && this.options.control) {
            return this.options.control.valid
        }
        else {
            return true
        }
    }

    public get isShowingMessage(): boolean {
        if (!this.isValid) {
            if (this.options &&
                this.options.control &&
                this.options.control.dirty &&
                this.hasBlurred &&
                !this.isFocused
            ) {
                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    }

    public get isShowingDefaultMessage(): boolean {
        return this.isShowingMessage && !!this.errorMessage && !this.customErrorMessage
    }

    public get isShowingCustomErrorMessage(): boolean {
        return this.isShowingMessage && !!this.customErrorMessage
    }

    public get currentError(): string | null {
        if (!this.options || !this.options.control) return null

        const errors = this.options.control.errors

        if (!errors) {
            return null
        }

        const errorsArr = Object.keys(errors).sort((a, b) => {
            return (this.orderOfErrorsDisplayed.indexOf(a) > this.orderOfErrorsDisplayed.indexOf(b))
                ? -1
                : 1
        })

        if (errorsArr.length) {
            return errorsArr[0]
        }
        else {
            return null
        }
    }

    private setErrorMessage(): void {
        if (this.currentError && Object.keys(FormErrors.fieldError).some(x => x === this.currentError)) {
            this.errorMessage = FormErrors.fieldError[this.currentError]
        }
        else {
            this.errorMessage = this.currentError ? 'Invalid ' + this.currentError : null
        }
    }
}
