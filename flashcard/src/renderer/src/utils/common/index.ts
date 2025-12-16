export const throttle = (fn: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout
    let time = new Date().getTime() 
    return (...args: any[]) => {
        const now = new Date().getTime()
        if (now - time < delay) {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                fn(...args)
                time = new Date().getTime()
            }, delay)
        } else {
            fn(...args)
            time = new Date().getTime()
        }
    }
}