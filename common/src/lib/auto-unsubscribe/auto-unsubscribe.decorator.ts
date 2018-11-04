// @credit NetanelBasal
// @link https://github.com/NetanelBasal/ngx-auto-unsubscribe/blob/master/src/auto-unsubscribe.ts

function isFunction(fn: any): boolean {
  return typeof fn === 'function'
}

/**
 * AutoUnsubscribe
 *
 * @export
 * @param {blackList: string[], includeArrays: boolean}
 * @returns
 */
export function AutoUnsubscribe({ blackList, includeArrays }: { blackList: string[], includeArrays: boolean } = {
    blackList: [],
    includeArrays: false,
}) {

    return function (constructor: Function) {
        const original = constructor.prototype.ngOnDestroy

        // Warn if ngOnDestroy is undefined (breaks AOT).
        if (!isFunction(original)) {
            console.warn(`${constructor.name} is using @AutoUnsubscribe but does not implement OnDestroy`)
        }

        constructor.prototype.ngOnDestroy = function() {
            for (const prop in this) {
                if (this.hasOwnProperty(prop)) {
                    const property = this[prop]
                    if (blackList.indexOf(prop) === -1 &&
                        property &&
                        isFunction(property.unsubscribe)) {
                        property.unsubscribe()
                    }

                    if (includeArrays && blackList.indexOf(prop) === -1 && Array.isArray(property)) {
                        property.forEach(singleProp => singleProp && isFunction(singleProp.unsubscribe) && singleProp.unsubscribe())
                    }
                }
            }

            if (isFunction(original)) {
                original.apply(this, arguments)
            }
        }
    }

}
