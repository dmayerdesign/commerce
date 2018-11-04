import { Tree } from '../models/common/tree'

export class TreeHelper {
    public static hasChildren<T extends Tree>(item: T): boolean {
        return !!item.children && !!item.children.length
    }
}
