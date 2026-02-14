import type { EffectCallback } from 'react';
import { useEffectOnce } from './use-effect-once';
import { isAuthorized } from '~helper/auth.helper';

export function useAuth(callback: EffectCallback) {
    useEffectOnce(() => {
        if (isAuthorized()) return callback();
    });
}
