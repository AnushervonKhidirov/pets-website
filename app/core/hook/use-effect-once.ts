import type { EffectCallback } from 'react';
import { useEffect } from 'react';

export function useEffectOnce(callback: EffectCallback) {
    let called = false;

    useEffect(() => {
        if (!called) {
            called = true;
            return callback();
        }
    }, []);
}
