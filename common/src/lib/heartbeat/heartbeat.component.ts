import { OnDestroy, OnInit } from '@angular/core'

export abstract class HeartbeatComponent implements OnInit, OnDestroy {
    protected isAlive = false
    public abstract ngOnInit(): void
    public abstract ngOnDestroy(): void
}
