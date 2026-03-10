import type { DescriptionsProps } from 'antd';
import type { Marker } from '~component/common/google-map';

import { useMutation } from '@tanstack/react-query';
import { useUserInfo } from '~hook/use-user-info';
import tokenService from '~service/token.service';
import authService from '~service/auth.service';

import { Link } from 'react-router';
import { Typography, Descriptions, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { Container, GoogleMap, Contacts } from '~component/common';
import { Route } from '~constant/route';

import classes from './personal-info.module.css';

export function meta() {
    return [{ title: 'Профиль' }];
}

const { Title } = Typography;

const signOut = authService.signOut.bind(authService);

const ProfilePage = () => {
    const { query, setData: setUser } = useUserInfo();

    if (!query.isSuccess) return null;

    const items: DescriptionsProps['items'] = [
        {
            key: 'name',
            label: 'Ф.И.О',
            styles: { content: { paddingBottom: 15 } },
            children: [query.data.firstName, query.data.lastName].join(' ').trim(),
        },
        {
            key: 'email',
            label: 'Почта',
            styles: { content: { paddingBottom: 15 } },
            children: query.data.email,
        },
        {
            key: 'phone',
            label: 'Номер телефона',
            styles: { content: { paddingBottom: 15 } },
            children: query.data.phone ?? '—',
        },
        {
            key: 'contacts',
            label: 'Дополнительные контакты',
            styles: { content: { paddingBottom: 15 } },
            children: <Contacts contacts={query.data.contacts} returnValueIfEmpty="—" />,
        },
        {
            key: 'address',
            label: 'Адрес',
            span: { sm: 2 },
            styles: { content: { paddingBottom: 15 } },
            children: query.data.address?.address ?? '—',
        },
    ];

    if (query.data.address?.latitude && query.data.address?.longitude) {
        const marker: Marker = {
            lat: query.data.address.latitude,
            lng: query.data.address?.longitude,
        };

        items.push({
            key: '6',
            label: 'Карта',
            styles: { label: { paddingBottom: 10 } },
            children: (
                <GoogleMap
                    defaultCenter={marker}
                    disableDefaultUI
                    defaultZoom={18}
                    markers={[marker]}
                    style={{
                        height: 'auto',
                        aspectRatio: '1/0.4',
                        minHeight: 200,
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius)',
                    }}
                />
            ),
        });
    }

    const { mutate } = useMutation({
        mutationKey: ['log_out'],
        mutationFn: signOut,
        onSettled: () => {
            tokenService.removeToken();
            setUser(null);
            globalThis.location.replace(Route.SignIn);
        },
    });

    return (
        <Container innerClassName={classes.section} style={{ minHeight: '100%' }} section>
            <Descriptions
                title={
                    <Title level={3} style={{ marginBottom: 0 }}>
                        <span className={classes.headline}>Персональные данные</span>
                    </Title>
                }
                layout="vertical"
                items={items}
                column={{ sm: 2, md: 3 }}
                extra={
                    <Link to={Route.ProfileSetting} target="_blank">
                        <Button color="cyan" variant="solid">
                            <SettingOutlined style={{ fontSize: '1.25em' }} />
                        </Button>
                    </Link>
                }
            />

            <div className={classes.buttons}>
                <Button
                    danger
                    type="primary"
                    onClick={() =>
                        mutate({ refreshToken: tokenService.getToken()?.refreshToken ?? null })
                    }
                >
                    Выйти
                </Button>

                <Button
                    danger
                    type="primary"
                    onClick={() =>
                        mutate({
                            refreshToken: tokenService.getToken()?.refreshToken ?? null,
                            allDevices: true,
                        })
                    }
                >
                    Выйти со всех устройств
                </Button>
            </div>
        </Container>
    );
};

export default ProfilePage;
