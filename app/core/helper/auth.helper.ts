import { PrivateRoutes } from '~constant/route';

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
