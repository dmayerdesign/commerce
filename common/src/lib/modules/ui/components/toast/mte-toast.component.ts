import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { takeWhile } from 'rxjs/operators'

import { AppConfig } from '@mte/app-config'
import { HeartbeatComponent } from '@mte/common/lib/heartbeat/heartbeat.component'
import { Heartbeat } from '@mte/common/lib/heartbeat/heartbeat.decorator'
import { Toast } from '../../../../../models/ui/toast'
import { timeout } from '../../utils/timeout'

@Component({
    selector: 'mte-toast',
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
    styleUrls: [ './mte-toast.component.scss' ],
})
@Heartbeat()
export class MteToastComponent extends HeartbeatComponent implements OnInit, OnDestroy {
    @Input() public toasts: Observable<Toast>

    public queue: Toast[] = []
    public toast: Toast
    public isShowing = false
    public isFadedIn = false
    public _config = AppConfig

    public subscriptions = {
        fadeInDelay: undefined,
        toastTimeout: undefined,
        showToastDelay: undefined,
    }

    public ngOnInit(): void {
        if (this.toasts) {
            this.toasts
                .pipe(takeWhile(() => this.isAlive))
                .subscribe(toast => {
                    this.queueToast(toast)
                    this.showToast()
                })
        }
    }

    public ngOnDestroy() { }

    private queueToast(toast: Toast) {
        this.queue.push(toast)
    }

    private showToast(wasQueued?: boolean) {
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

    private endToast() {
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

    public close() {
        this.endToast()
    }
}
