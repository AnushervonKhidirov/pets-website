export type User = {
    id: number;
    authType: AuthType;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string | null;
    contacts: Contact[];
    address: Address | null;
};

export type UpdateUserDto = Partial<{
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    contacts: string | null; // Json of Contact[]
    address: Omit<Address, 'id'> | null;
}>;

export type UserFromResponse = Omit<User, 'contacts'> & {
    contacts: string | null;
};

export type Address = {
    id: number;
    address: string;
    latitude?: string;
    longitude?: string;
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
