import type { EffectCallback } from 'react';
import { useEffectOnce } from './use-effect-once';
import { isLoggedIn } from '~helper/auth.helper';

export function useAuth(callback: EffectCallback) {
    useEffectOnce(() => {
        if (isLoggedIn()) return callback();
    });
}
