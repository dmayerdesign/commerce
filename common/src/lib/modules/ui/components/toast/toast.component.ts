import { Component, Input, OnInit } from '@angular/core'
import { AppConfig } from '@qb/app-config'
import { forLifeOf } from '@qb/common/domains/ui-component/ui-component.helpers'
import { Toast } from '@qb/common/models/ui/toast'
import { Observable, Subscription } from 'rxjs'
import { timeout } from '../../utils/timeout'

@Component({
    selector: 'qb-web-toast',
    template: `
        <div *ngIf="isShowing"
             class="toast-container toast-type-{{ toast.type }}">
            <div class="toast-inner"
                 [ngClass]="{
                     'is-faded-in': isFadedIn
                 }">

                <button class="blank-btn toast-close-btn" (click)="close()">
                    <img alt="close toast" [src]="_config.client_url + '/images/x-dark.svg'">
                </button>

                <p class="toast-content">
                    {{ toast.message }}
                </p>
            </div>
        </div>
    `,
    styleUrls: [ './toast.component.scss' ],
})
export class ToastComponent implements OnInit {
    @Input() public toasts: Observable<Toast>

    public queue: Toast[] = []
    public toast: Toast
    public isShowing = false
    public isFadedIn = false
    public _config = AppConfig

    public subscriptions = {
        fadeInDelay: undefined as Subscription | undefined,
        toastTimeout: undefined as Subscription | undefined,
        showToastDelay: undefined as Subscription | undefined,
    }

    public ngOnInit(): void {
        if (this.toasts) {
            this.toasts
                .pipe(forLifeOf(this))
                .subscribe(toast => {
                    this.queueToast(toast)
                    this.showToast()
                })
        }
    }

    private queueToast(toast: Toast): void {
        this.queue.push(toast)
    }

    private showToast(wasQueued?: boolean): void {
        const delay = wasQueued ? 200 : 0

        if (this.subscriptions.showToastDelay) {
            this.subscriptions.showToastDelay.unsubscribe()
        }

        this.subscriptions.showToastDelay = timeout(delay).subscribe(() => {
            this.toast = this.queue[0]
            this.isShowing = true

            if (this.subscriptions.fadeInDelay) {
                this.subscriptions.fadeInDelay.unsubscribe()
            }
            if (this.subscriptions.toastTimeout) {
                this.subscriptions.toastTimeout.unsubscribe()
            }

            this.subscriptions.fadeInDelay = timeout(10).subscribe(() => {
                this.isFadedIn = true
            })

            this.subscriptions.toastTimeout = timeout(this.toast.timeout).subscribe(() => {
                this.endToast()
            })
        })
    }

    private endToast(): void {
        this.isShowing = false
        this.isFadedIn = false
        this.queue.shift()

        if (this.subscriptions.toastTimeout) {
            this.subscriptions.toastTimeout.unsubscribe()
        }
        if (this.queue.length) {
            this.showToast(true)
        }
    }

    public close(): void {
        this.endToast()
    }
}
