import type { User } from '~type/user.type';

import { Link } from 'react-router';
import { Typography } from 'antd';

import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ContactLinks, isContactItem } from '~constant/contact-links';

const { Text } = Typography;

export function getPhoneNumberNode(phone: string | null) {
    if (!phone) return '—';
    const phoneData = parsePhoneNumberFromString(phone, 'TJ');
    if (!phoneData) return '—';
    return <Link to={'tel:' + phoneData.number}>{phoneData.nationalNumber}</Link>;
}

export function getContactsNode(contacts: User['contacts']) {
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
