import { OnDestroy, OnInit } from '@angular/core'

export function Heartbeat(): ClassDecorator {

    return function(constructor: Function): void {
        const proto = constructor.prototype as (OnInit & OnDestroy)
        const onInit = constructor.prototype.ngOnInit
        const onDestroy = constructor.prototype.ngOnDestroy

        // Warn if ngOnDestroy or ngOnInit is undefined (breaks AOT).
        if (typeof onInit !== 'function') {
            console.warn(`${constructor.name} is using @Heartbeat but does not implement OnInit`)
        }
        if (typeof onDestroy !== 'function') {
            console.warn(`${constructor.name} is using @Heartbeat but does not implement OnDestroy`)
        }

        proto.ngOnInit = function() {
            this.isAlive = true

            if (typeof onInit === 'function') {
                onInit.apply(this, arguments)
            }
        }

        proto.ngOnDestroy = function() {
            this.isAlive = false

            if (typeof onDestroy === 'function') {
                onDestroy.apply(this, arguments)
            }
        }
    }
}
