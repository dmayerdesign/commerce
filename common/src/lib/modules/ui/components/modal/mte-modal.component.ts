import { Component, ElementRef, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms'
import { AppConfig } from '@mte/app-config'
import { Observable, Subscription } from 'rxjs'
import { Copy } from '../../../../../constants'
import { ModalType } from '../../../../../constants/enums/modal-type'
import { ModalData } from '../../../../../models/ui/modal-data'
import { WindowRefService } from '../../services/window-ref.service'
import { platform } from '../../utils/platform'
import { timeout } from '../../utils/timeout'

@Component({
    selector: 'mte-modal',
    template: `
        <div *ngIf="isShowing && data"
             #modal
             class="modal"
             tabindex="-1"
             [ngClass]="[
                getModalContainerClass(),
                getModalShowingClass()
             ]">
            <div class="modal-darken"
                 [ngStyle]="{'opacity': isFadedIn ? 1 : 0}"
                 (click)="cancel()">
            </div>
            <div class="modal-dialog" role="document">
                <div class="modal-content"
                     [ngStyle]="{
                         'opacity': isFadedIn ? 1 : 0,
                         'top': scrollYWhenOpened
                     }">

                    <header class="modal-header"
                            *ngIf="data.type !== 'banner'">
                        <h2 class="modal-title">{{ data.title }}</h2>
                        <button (click)="cancel()" class="close">
                            <img alt="close modal" [src]="appConfig.client_url + '/images/x-dark.svg'">
                        </button>
                    </header>

                    <div class="modal-body">

                        <ng-container *ngIf="isBanner()">
                            <h1>{{ data.title }}</h1>
                            <p class="banner-subtitle">
                                {{ data.banner.subtitle }}
                            </p>
                            <button (click)="data.banner.cta.onClick($event)">
                                {{ data.banner.cta.text }}
                            </button>
                        </ng-container>

                        <ng-container *ngIf="hasCustomTemplate()">
                            <ng-container *ngTemplateOutlet="data.content; context: data.context">
                            </ng-container>
                        </ng-container>

                    </div>

                    <footer class="modal-footer"
                         *ngIf="data.type !== modalType.Banner">
                        <button (click)="cancel()" class="btn-cancel modal-cancel">
                            {{ data.cancelText || defaultCancelText }}
                        </button>
                        <button *ngIf="data.okText" (click)="data.okClick()" class="btn-action modal-ok">
                            {{ data.okText }}
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    `,
    styleUrls: [ './mte-modal.component.scss' ]
})
export class MteModalComponent implements OnInit, OnDestroy {
    @Input() public datas: Observable<ModalData>
    @Input() public closeCallback?: () => void

    @ViewChild('modal', { read: ElementRef }) public modal: ElementRef

    public data: ModalData = null
    public defaultCancelText = Copy.Actions.cancel
    public isShowing = false
    public isFadedIn = false
    public appConfig = AppConfig
    public modalType = ModalType
    public formGroup: FormGroup
    public scrollYWhenOpened = 0
    private isTransitioning = false
    private modalInner: HTMLElement

    private dataSub: Subscription
    private initFadeInTimerSub: Subscription
    private endFadeInTimerSub: Subscription
    private endFadeOutTimerSub: Subscription

    constructor(
        private formBuilder: FormBuilder,
        private renderer: Renderer2,
        private windowRef: WindowRefService,
    ) {}

    public ngOnInit(): void {
        this.dataSub = this.datas.subscribe((data) => {
            this.show(data)
        })
    }

    public ngOnDestroy(): void { }

    private show(data: ModalData): void {
        if (this.isTransitioning) return
        this.isTransitioning = true
        this.data = data

        if (this.data) {
            this.isShowing = true
            this.scrollYWhenOpened = this.windowRef.scrollPositionY
            this.initFadeInTimerSub = timeout(10).subscribe(() => {
                if (platform.isBrowser()) {
                    this.updateYPos(window.scrollY)
                }
                this.isFadedIn = true;
                // DOM access.
                (this.modal.nativeElement as HTMLElement).focus()
            })
            this.endFadeInTimerSub = timeout(400).subscribe(() => {
                this.isTransitioning = false
            })
        }
        else {
            this.isFadedIn = false
            this.endFadeOutTimerSub = timeout(400).subscribe(() => {
                this.isShowing = false
                this.isTransitioning = false
                if (this.closeCallback) {
                    this.closeCallback()
                }
            })
        }
    }

    public updateYPos(scrollTop: number): void {
        this.modalInner = <HTMLElement>document.querySelector('.showing .modal-inner-wrapper')
        if (!this.modalInner) return
        this.modalInner.style.top = (scrollTop / 10 + 11).toString() + 'rem'
    }

    public cancel(): void {
        this.show(null)
    }

    public getModalContainerClass(): string {
        return 'modal-' + this.data.type + '-container'
    }

    public getModalShowingClass(): string {
        if (this.isShowing && this.data) {
            return 'show'
        }
        return ''
    }

    // Identifiers.

    public isBanner(): boolean {
        return this.data.type === this.modalType.Banner && !!this.data.banner
    }

    public hasCustomTemplate(): boolean {
        return !!this.data.template && !!this.data.context
    }
}
