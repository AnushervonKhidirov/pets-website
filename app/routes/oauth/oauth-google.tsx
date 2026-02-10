import { useEffectOnce } from '~hook/use-effect-once';
import { useSearchParams } from 'react-router';
import { BroadcastChannelName } from '~constant/broadcast-channel';

import { googleOAuthService } from '~service/oauth.service';
import tokenService from '~service/token.service';

export function meta() {
    return [{ title: 'Google Auth' }];
}

export default function GoogleOAuth() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    useEffectOnce(() => {
        if (error || !code) return globalThis.close();
        handleAuth(code);
    });

    return null;
}

async function handleAuth(code: string) {
    const bc = new BroadcastChannel(BroadcastChannelName.AuthBroadcast);
    const [token, err] = await googleOAuthService.signIn(code);

    if (err) {
        bc.postMessage('error');
        tokenService.removeToken();
    } else {
        tokenService.setToken(token);
        bc.postMessage('success');
    }

    bc.close();
    globalThis.close();
}
