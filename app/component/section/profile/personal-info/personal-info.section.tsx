import type { FC } from 'react';
import type { User } from '~type/user.type';
import type { DescriptionsProps } from 'antd';

import { useState } from 'react';

import { Link } from 'react-router';
import { Typography, Descriptions, Button } from 'antd';
import Container from '~commons/container/container';
import EditPersonalInfoModal from '~component/profile/edit-personal-info-modal';

import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ContactLinks, isContactItem } from '~constant/contact-links';

const { Title, Text } = Typography;

const PersonalInfoSection: FC<{ user: User }> = ({ user }) => {
    const [open, setOpen] = useState(false);

    const items = [
        {
            key: '1',
            label: 'Ф.И.О',
            children: [user.firstName, user.lastName].join(' ').trim(),
        },
        {
            key: '2',
            label: 'Почта',
            children: user.email,
        },
        {
            key: '3',
            label: 'Номер телефона',
            children: getPhoneNumberNode(user.phone),
        },
        {
            key: '4',
            label: 'Дополнительные контакты',
            children: getContactsNode(user.contacts),
        },
        {
            key: '5',
            label: 'Адрес',
            children: user.address?.address ?? '—',
        },
    ] satisfies DescriptionsProps['items'];

    return (
        user && (
            <Container section>
                <Descriptions
                    title={<Title level={3}>Персональные данные</Title>}
                    layout="vertical"
                    items={items}
                    column={{ sm: 2, md: 3 }}
                    extra={
                        <Button color="cyan" variant="solid" onClick={() => setOpen(true)}>
                            Редактировать
                        </Button>
                    }
                />

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
    if (contacts.length === 0) return '—';

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
                            <Link to={link + value.replace('@', '')} target="_blank">
                                {value}
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
