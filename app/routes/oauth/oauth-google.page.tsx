import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { BroadcastChannelName } from '~constant/broadcast-channel';

import { googleOAuthService } from '~service/oauth.service';
import tokenService from '~service/token.service';

export function meta() {
    return [{ title: 'Google Auth' }];
}

export default function GoogleOAuth() {
    const bc = new BroadcastChannel(BroadcastChannelName.AuthBroadcast);
    const [searchParams] = useSearchParams();

    const params = {
        code: searchParams.get('code'),
        error: searchParams.get('error'),
    };

    const { isError, isSuccess, isFetched, error, data } = useQuery({
        queryKey: ['google_oauth'],
        queryFn: async () => {
            if (params.error || !params.code) {
                globalThis.close();
                throw new Error(params.error ?? 'Unknown error!');
            }
            return await googleOAuthService.signIn(params.code);
        },
    });

    if (isError) {
        console.log('error', error);
        bc.postMessage('error');
        tokenService.removeToken();
    }

    if (isSuccess) {
        console.log('data', data);
        tokenService.setToken(data);
        bc.postMessage('success');
    }

    if (isFetched) {
        console.log('isFetched');
        bc.close();
        globalThis.close();
    }
}
