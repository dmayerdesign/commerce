import {
    AfterContentInit,
    Component,
    ContentChild,
    ElementRef,
    Input,
    OnInit,
    TemplateRef,
} from '@angular/core'
import { FormErrors } from '@qb/common/constants/copy'
import { forLifeOf, MortalityAware } from '@qb/common/domains/ui-component/ui-component.helpers'
import { fromEvent } from 'rxjs'
import { FormFieldOptions } from '../../models/form-field-options'

@MortalityAware()
@Component({
    selector: 'qb-web-form-field',
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
export class FormFieldComponent implements OnInit, AfterContentInit {
    @Input() public options: FormFieldOptions = {
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
            control.statusChanges.pipe(forLifeOf(this))
                .subscribe(() => {
                    this.setErrorMessage()
                })

            if (control.parent) {
                control.parent.statusChanges.pipe(forLifeOf(this))
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
content child of <qb-web-form-field>, like so:

    <qb-web-form-field [options]="{ label: 'Email' }">
        <input #input formControlName="email">
    </qb-web-form-field>\n`)
        }

        if (!this.options || typeof this.options.formControlType === 'undefined') {
            this.options.formControlType = (function(): 'input'|'select'|'checkbox' {
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
            .pipe(forLifeOf(this))
            .subscribe(() => {
                this.isFocused = false
                this.hasBlurred = true
            })

        fromEvent(nativeElement, 'focus')
            .pipe(forLifeOf(this))
            .subscribe(() => {
                this.isFocused = true
            })
    }

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
