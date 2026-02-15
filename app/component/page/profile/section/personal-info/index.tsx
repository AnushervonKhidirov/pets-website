import type { FC } from 'react';
import type { DescriptionsProps } from 'antd';
import type { User } from '~type/user.type';
import type { Coordinate } from '~component/common/google-map';

import { useState } from 'react';
import useUserStore from '~store/user.store';
import tokenService from '~service/token.service';
import authService from '~service/auth.service';

import { Link } from 'react-router';
import { Typography, Descriptions, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Container, GoogleMap } from '~component/common';
import EditPersonalInfoModal from '../../edit-personal-info-modal';

import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ContactLinks, isContactItem } from '~constant/contact-links';

import classes from './personal-info.module.css';

const { Title, Text } = Typography;

const PersonalInfoSection: FC<{ user: User }> = ({ user }) => {
    const { clearUserData } = useUserStore(state => state);
    const [open, setOpen] = useState(false);

    async function logOut(allDevices: boolean = false) {
        const token = tokenService.getToken();

        if (token) await authService.signOut({ refreshToken: token.refreshToken }, allDevices);
        tokenService.removeToken();
        clearUserData();

        globalThis.location.replace('/');
    }

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Ф.И.О',
            styles: { content: { paddingBottom: 15 } },
            children: [user.firstName, user.lastName].join(' ').trim(),
        },
        {
            key: '2',
            label: 'Почта',
            styles: { content: { paddingBottom: 15 } },
            children: user.email,
        },
        {
            key: '3',
            label: 'Номер телефона',
            styles: { content: { paddingBottom: 15 } },
            children: getPhoneNumberNode(user.phone),
        },
        {
            key: '4',
            label: 'Дополнительные контакты',
            styles: { content: { paddingBottom: 15 } },
            children: getContactsNode(user.contacts),
        },
        {
            key: '5',
            label: 'Адрес',
            span: { sm: 2 },
            styles: { content: { paddingBottom: 15 } },
            children: user.address?.address ?? '—',
        },
    ];

    if (user.address?.latitude && user.address?.longitude) {
        const coordinate: Coordinate = { lat: user.address.latitude, lng: user.address?.longitude };

        items.push({
            key: '6',
            label: 'Карта',
            styles: { label: { paddingBottom: 10 } },
            children: (
                <GoogleMap
                    defaultCenter={coordinate}
                    defaultZoom={18}
                    markers={[coordinate]}
                    style={{ height: 'auto', aspectRatio: '1/0.4', minHeight: 200 }}
                />
            ),
        });
    }

    return (
        user && (
            <Container section>
                <Descriptions
                    title={
                        <Title level={3}>
                            <span className={classes.headline}>Персональные данные</span>
                        </Title>
                    }
                    layout="vertical"
                    items={items}
                    column={{ sm: 2, md: 3 }}
                    extra={
                        <Button color="cyan" variant="solid" onClick={() => setOpen(true)}>
                            <EditOutlined style={{ fontSize: '1.25em' }} />
                        </Button>
                    }
                />

                <div className={classes.buttons}>
                    <Button danger type="primary" onClick={() => logOut()}>
                        Выйти
                    </Button>

                    <Button danger type="primary" onClick={() => logOut(true)}>
                        Выйти со всех устройств
                    </Button>
                </div>

                <EditPersonalInfoModal user={user} open={open} setOpen={setOpen} />
            </Container>
        )
    );
};

function getPhoneNumberNode(phone: string | null) {
    if (!phone) return '—';
    const phoneData = parsePhoneNumberFromString(phone, 'TJ');
    if (!phoneData) return '—';
    return <Link to={'tel:' + phoneData.number}>{phoneData.nationalNumber}</Link>;
}

function getContactsNode(contacts: User['contacts']) {
    if (!contacts || contacts.length === 0) return '—';

    return (
        <div>
            {contacts.map(({ name, value }) => {
                if (!isContactItem(name)) return null;
                const nameLowercase = name.toLowerCase() as Lowercase<typeof name>;
                const link = ContactLinks[nameLowercase];

                return (
                    <div key={name + value}>
                        <Text>{name}:</Text>{' '}
                        {link ? (
                            <Link to={link + value} target="_blank">
                                @{value}
                            </Link>
                        ) : (
                            <Text type="secondary">{value}</Text>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default PersonalInfoSection;
