import tokenService from '~service/token.service';
import { PrivateRoutes } from '~constant/route';

export function isAuthorized() {
    if (!globalThis.window) return false;
    return !!tokenService.getToken();
}

export function isInPrivatePage() {
    let isPrivate = false;

    for (const route of PrivateRoutes) {
        if (globalThis.location.pathname.includes(route)) {
            isPrivate = true;
            break;
        }
    }

    return isPrivate;
}
