export function pushTo<T>(arr: T[], item: T): T[] {
    if (!arr.find((x) => x === item)) {
        arr.push(item)
    }
    return arr
}

export function pullFrom<T>(arr: T[], item: T): T[] {
    let index = -1
    const find = arr.find((x, i) => {
        index = i
        return x === item
    })
    if (find) {
        arr.splice(index, 1)
    }
    return arr
}
