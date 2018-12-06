export function pushTo<T>(arr: T[], item: T): void {
    if (!arr.find((x) => x === item)) {
        arr.push(item)
    }
}

export function pullFrom<T>(arr: T[], item: T): void {
    let index = -1
    const find = arr.find((x, i) => {
        index = i
        return x === item
    })
    if (find) {
        arr.splice(index, 1)
    }
}
