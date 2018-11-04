export abstract class Action<PayloadType = any> {
    public description?: any
    constructor(public payload: PayloadType) { }
}

export class Clear extends Action {
    constructor(public payload = null) {
        super(payload)
    }
}
