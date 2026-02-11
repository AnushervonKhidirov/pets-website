export type User = {
    id: number;
    authType: AuthType;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string | null;
    contacts: string | null;
    address: Address[];
};

export type Address = {
    id: number;
    address: string;
    latitude: string;
    longitude: string;
};

export enum AuthType {
    Local = 'Local',
    Google = 'Google',
    Yandex = 'Yandex',
}
