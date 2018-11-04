import { Action } from '@ngrx/store'

export abstract class NgrxAction implements Action {
    public abstract type: string
}

export abstract class NgrxMessage<PayloadType = any> implements Action {
    public abstract type: string
    constructor(
        public payload?: PayloadType
    ) { }
}
