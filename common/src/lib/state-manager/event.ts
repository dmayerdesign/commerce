import { Action } from './action'

export class DomainEvent<StateType = any> {
    public action: Action<StateType>
    public state: StateType
    public completed: boolean

    constructor({ state, action, completed }: DomainEvent) {
        this.state = state
        this.action = action
        this.completed = completed
    }
}
