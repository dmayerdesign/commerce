export class MongooseHelper {
    public static toArray<T = any>(arrayLikeObject: object): T[] {
        if (Array.isArray(arrayLikeObject)) {
            return arrayLikeObject
        }
        if (typeof arrayLikeObject === 'object') {
            return Object.keys(arrayLikeObject)
                .filter((key) => !key.match(/\D/g) && !isNaN(parseInt(key, 10)))
                .map((key) => arrayLikeObject[key])
        }
        return []
    }
}
