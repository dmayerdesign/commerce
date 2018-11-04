import { Subject } from 'rxjs'

export abstract class Stateful<T> {
    protected abstract _state: T
    private _statePump = new Subject<T>()
    private _isSilent = false
    public states = this._statePump.asObservable()
    public onStateChange: (newState: T) => void

    constructor() {
        this.states.subscribe(() => {
            if (
                !this._isSilent &&
                typeof this.onStateChange === 'function'
            ) {
                this.onStateChange(this._state)
            }
        })
    }

    public setState(newState: T): void {
        this._state = Object.assign({}, this._state, newState)
        if (!this._isSilent) {
            this._statePump.next(this._state)
        }
    }

    public setStateSilently(newState: T): void {
        this._silence()
        this.setState(newState)
        this._unsilence()
    }

    public get state(): T {
        return this._state
    }

    private _silence(): void {
        this._isSilent = true
    }

    private _unsilence(): void {
        this._isSilent = false
    }
}
