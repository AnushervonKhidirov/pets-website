import { TokenName } from '~constant/token';

export function isLoggedIn() {
    if (!globalThis.window) return false;
    if (localStorage.getItem(TokenName.Access) && localStorage.getItem(TokenName.Refresh)) {
        return true;
    }
    return false;
}
