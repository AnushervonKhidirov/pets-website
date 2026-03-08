import type { EffectCallback } from 'react';
import { useLayoutEffect } from 'react';
import { isAuthorized } from '~helper/auth.helper';

export function useAuth(callback: EffectCallback) {
    let called = false;

    useLayoutEffect(() => {
        if (isAuthorized() && !called) {
            called = true;
            return callback();
        }
    }, []);
}
