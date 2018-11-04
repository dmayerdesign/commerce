import { Action } from './action'

export type Reducer<T> = (state: T, action: Action) => T

export type AsyncReducer<T> = (state: T, action: Action) => Promise<T>
