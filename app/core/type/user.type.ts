import { ContactName } from '~constant/contact-links';

export type User = {
    id: number;
    authType: AuthType;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string | null;
    contacts: Contact[] | null;
    address: Address | null;
    avatar: string | null;
};

export type UpdateUserDto = Partial<{
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    contacts: Contact[] | null;
    address: Omit<Address, 'id'> | null;
}>;

export type Address = {
    id: number;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
};

export type Contact = {
    name: ContactName;
    value: string;
};

export enum AuthType {
    Local = 'Local',
    Google = 'Google',
    Yandex = 'Yandex',
}
