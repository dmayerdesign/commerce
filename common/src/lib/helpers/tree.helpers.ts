import { Tree } from '../models/common/tree'

export function hasChildren<T extends Tree>(item: T): boolean {
    return !!item.children && !!item.children.length
}
