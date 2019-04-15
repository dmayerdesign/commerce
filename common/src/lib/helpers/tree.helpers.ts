export function hasChildren<T extends { children?: T[] }>(item: T): boolean {
    return !!item.children && !!item.children.length
}
