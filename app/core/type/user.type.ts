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

export type Address = {
    address: string | null;
    latitude: number | null;
    longitude: number | null;
};

export type Contact = {
    name: string;
    value: string;
};

export enum AuthType {
    Local = 'Local',
    Google = 'Google',
    Yandex = 'Yandex',
}

export type UpdateUserDto = {
    firstName: User['firstName'];
    lastName: User['lastName'];
    phone: User['phone'];
    contacts: User['contacts'];
    address: Address | null;
};

export type UpdateUserFormData = Record<string, string> & {
    firstName: User['firstName'];
    lastName?: User['lastName'];
    phone?: User['phone'];
    address?: Address['address'];
    latitude?: Address['latitude'];
    longitude?: Address['longitude'];
};
