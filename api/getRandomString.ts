export function getRandomString(length: number): string {
    const randomID: string = Math.random().toString(36).slice(2, length)
    return randomID;
}