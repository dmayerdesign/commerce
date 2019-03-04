import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { AppConfig } from '@qb/app-config'
import { Actions } from '@qb/common/constants/copy'
import { ModalType } from '@qb/common/constants/enums/modal-type'
import { HeartbeatComponent } from '@qb/common/heartbeat/heartbeat.component'
import { Heartbeat } from '@qb/common/heartbeat/heartbeat.decorator'
import { ModalData } from '@qb/common/models/ui/modal-data'
import { Observable } from 'rxjs'
import { takeWhile } from 'rxjs/operators'
import { WindowRefService } from '../../services/window-ref.service'
import { platform } from '../../utils/platform'
import { timeout } from '../../utils/timeout'

@Component({
    selector: 'qb-modal',
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
                 (click)="cancel($event)">
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
                        <button (click)="cancel($event)" class="close">
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
                            <ng-container *ngTemplateOutlet="data.template; context: data.context">
                            </ng-container>
                        </ng-container>

                    </div>

                    <footer class="modal-footer"
                         *ngIf="data.type !== modalType.Banner">
                        <button (click)="cancel($event)" class="btn-cancel modal-cancel">
                            {{ data.footer?.cancelText || defaultCancelText }}
                        </button>
                        <button *ngIf="data.footer?.okText && data.footer?.onOk" (click)="data.footer.onOk($event)" class="btn-action modal-ok">
                            {{ data.footer?.okText }}
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    `,
    styleUrls: [ './modal.component.scss' ]
})
@Heartbeat()
export class QbModalComponent extends HeartbeatComponent implements OnInit, OnDestroy {
    @Input() public datas: Observable<ModalData>
    @Input() public closeCallback?: () => void

    @ViewChild('modal', { read: ElementRef }) public modal: ElementRef

    public data?: ModalData = undefined
    public defaultCancelText = Actions.CANCEL
    public isShowing = false
    public isFadedIn = false
    public appConfig = AppConfig
    public modalType = ModalType
    public formGroup: FormGroup
    public scrollYWhenOpened = 0
    private isTransitioning = false
    private modalInner: HTMLElement

    constructor(
        private windowRef: WindowRefService,
    ) { super() }

    public ngOnInit(): void {
        this.datas
            .pipe(takeWhile(() => this.isAlive))
            .subscribe((data) => {
                this.next(data)
            })
    }

    public ngOnDestroy(): void { }

    private next(data?: ModalData): void {
        if (this.isTransitioning) return
        this.isTransitioning = true
        this.data = data

        if (this.data) {
            this.isShowing = true
            this.scrollYWhenOpened = this.windowRef.scrollPositionY
            timeout(10)
                .pipe(takeWhile(() => this.isAlive))
                .subscribe(() => {
                    if (platform.isBrowser()) {
                        this.updateYPos(window.scrollY)
                    }
                    this.isFadedIn = true;
                    // DOM access.
                    (this.modal.nativeElement as HTMLElement).focus()
                })
            timeout(400)
                .pipe(takeWhile(() => this.isAlive))
                .subscribe(() => {
                    this.isTransitioning = false
                })
        }
        else {
            this.isFadedIn = false
            timeout(400)
                .pipe(takeWhile(() => this.isAlive))
                .subscribe(() => {
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

    public cancel(event: Event): void {
        this.next()
        if (this.data && this.data.footer && this.data.footer.onCancel) {
            this.data.footer.onCancel(event)
        }
    }

    public getModalContainerClass(): string {
        if (this.data) {
            return 'modal-' + this.data.type + '-container'
        }
        return ''
    }

    public getModalShowingClass(): string {
        if (this.isShowing && this.data) {
            return 'show'
        }
        return ''
    }

    // Identifiers.

    public isBanner(): boolean {
        return !!this.data &&
            this.data.type === this.modalType.Banner &&
            !!this.data.banner
    }

    public hasCustomTemplate(): boolean {
        return !!this.data &&
            !!this.data.template &&
            !!this.data.context
    }
}
