import type { CSSProperties, FC, ReactNode } from 'react';
import type { ButtonProps } from 'antd';
import type { User } from '~type/user.type';

import { Link } from 'react-router';
import { Typography, Button } from 'antd';
import { PhoneIcon } from '~icons';

import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ContactLinks } from '~constant/contact-links';

const { Text } = Typography;

type PhoneLinkProps = {
    phone: string | null;
    returnValueIfEmpty?: ReactNode;
    asButton?: boolean | null;
    buttonProps?: ButtonProps;
    includeIcon?: boolean;
    style?: CSSProperties;
};

type ContactProps = {
    contacts: User['contacts'];
    email?: string;
    returnValueIfEmpty?: ReactNode;
};

export const PhoneLink: FC<PhoneLinkProps> = ({
    phone,
    returnValueIfEmpty = null,
    asButton,
    includeIcon,
    buttonProps = {},
    style,
}) => {
    if (!phone) return returnValueIfEmpty;
    const phoneData = parsePhoneNumberFromString(phone, 'TJ');
    if (!phoneData) return returnValueIfEmpty;

    if (asButton)
        return (
            <Link to={'tel:' + phoneData.number} style={style}>
                <Button icon={includeIcon ? <PhoneIcon /> : undefined} {...buttonProps}>
                    Позвонить
                </Button>
            </Link>
        );

    return (
        <Link to={'tel:' + phoneData.number} style={style}>
            Позвонить
        </Link>
    );
};

export const Contacts: FC<ContactProps> = ({ contacts, email, returnValueIfEmpty = null }) => {
    if (!contacts) return returnValueIfEmpty;

    const contactList = email ? [...contacts, { name: 'Email', value: email }] : contacts;
    if (contactList.length === 0) return returnValueIfEmpty;

    return (
        <div>
            {contactList.map(({ name, value }) => {
                const key = name.toLowerCase();
                const link =
                    key in ContactLinks ? ContactLinks[key as keyof typeof ContactLinks] : null;

                return (
                    <div key={name + value}>
                        <Text>{name}:</Text>{' '}
                        {link ? (
                            <Link to={link.value + value} target="_blank">
                                {link.prefix}
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
};
