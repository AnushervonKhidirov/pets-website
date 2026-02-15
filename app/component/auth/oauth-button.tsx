import type { FC } from 'react';
import type { ButtonProps } from 'antd';

import { useState } from 'react';
import { googleOAuthService } from '~service/oauth.service';

import { ConfigProvider, Button, notification } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { alertError } from '~helper/alert-error';

import { BroadcastChannelName } from '~constant/broadcast-channel';

export const GoogleOAuthButton: FC<ButtonProps> = props => {
    const [loading, setLoading] = useState(false);
    const [api, context] = notification.useNotification();

    async function redirect() {
        setLoading(true);

        const [url, err] = await googleOAuthService.getUrl();

        if (err) {
            api.error(alertError(err));
        } else {
            globalThis.open(url, '_blank');

            const bc = new BroadcastChannel(BroadcastChannelName.AuthBroadcast);

            bc.onmessage = event => {
                if (event.data === 'success') {
                    globalThis.location.reload();
                    bc.close();
                }

                if (event.data === 'error') bc.close();
            };
        }

        setLoading(false);
    }

    return (
        <ConfigProvider theme={{ token: { red: '#d0463b' } }}>
            <Button
                {...props}
                color="red"
                variant="solid"
                icon={<GoogleOutlined />}
                onClick={redirect}
                loading={loading}
            >
                Войти с помощью Google
            </Button>

            {context}
        </ConfigProvider>
    );
};
