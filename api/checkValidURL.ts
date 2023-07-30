export function checkValidURL(urlValue: string): boolean {
    const regex = new RegExp('^(http(s)?)?(:\/\/)?(www).?([a-zA-Z0-9]+)\.?([a-z]+)?\.([a-z]+)$')
    if (regex.test(urlValue)) {
        return true;
    } else {
        return false;
    }
}