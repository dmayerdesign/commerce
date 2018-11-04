export const platform = {
    isServer() {
        return typeof window === 'undefined'
    },
    isBrowser() {
        return typeof window !== 'undefined'
    }
}
