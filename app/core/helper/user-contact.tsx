import type { User } from '~type/user.type';
import type { ButtonProps } from 'antd';

import { Link } from 'react-router';
import { Typography, Button } from 'antd';

import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ContactLinks, isContactItem } from '~constant/contact-links';

const { Text } = Typography;

export function getPhoneNumberNode(
    phone: string | null,
    asButton: boolean = false,
    buttonProps: ButtonProps = {},
) {
    if (!phone) return null;
    const phoneData = parsePhoneNumberFromString(phone, 'TJ');
    if (!phoneData) return null;

    if (asButton)
        return (
            <Link to={'tel:' + phoneData.number}>
                <Button {...buttonProps}>{phoneData.nationalNumber}</Button>
            </Link>
        );

    return <Link to={'tel:' + phoneData.number}>{phoneData.nationalNumber}</Link>;
}

export function getContactsNode(contacts: User['contacts']) {
    if (!contacts || contacts.length === 0) return null;

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
