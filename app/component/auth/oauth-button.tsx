import type { FC } from 'react';
import type { ButtonProps } from 'antd';

import { useMutation } from '@tanstack/react-query';
import { googleOAuthService } from '~service/oauth.service';

import { ConfigProvider, Button, notification } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

import { BroadcastChannelName } from '~constant/broadcast-channel';
import { Route } from '~constant/route';

const getOAuthUrl = googleOAuthService.getUrl.bind(googleOAuthService);

export const GoogleOAuthButton: FC<ButtonProps> = props => {
    const [api, context] = notification.useNotification();

    const { mutate, isPending } = useMutation({
        mutationKey: ['google_oauth_url'],
        mutationFn: getOAuthUrl,
        onSuccess: url => {
            globalThis.open(url, '_blank');

            const bc = new BroadcastChannel(BroadcastChannelName.AuthBroadcast);

            bc.onmessage = event => {
                if (event.data === 'success') {
                    bc.close();
                    globalThis.location.replace(Route.Home);
                }

                if (event.data === 'error') bc.close();
            };
        },
        onError: err => {
            api.error({ description: err.message });
        },
    });

    return (
        <ConfigProvider theme={{ token: { red: '#d0463b' } }}>
            <Button
                {...props}
                color="red"
                variant="solid"
                icon={<GoogleOutlined />}
                onClick={() => mutate()}
                loading={isPending}
            >
                Войти с помощью Google
            </Button>

            {context}
        </ConfigProvider>
    );
};
