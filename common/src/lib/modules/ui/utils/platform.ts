export const platform = {
    isServer(): boolean {
        return typeof window === 'undefined'
    },
    isBrowser(): boolean {
        return typeof window !== 'undefined'
    }
}
