export enum ContactName {
    Telegram = 'Telegram',
    WhatsApp = 'WhatsApp',
}

export type ContactLinksType =
    | Partial<Record<Lowercase<ContactName>, ContactLinksValue>>
    | Record<string, ContactLinksValue>;

export type ContactLinksValue = {
    value: string;
    prefix?: string;
};

export const ContactLinks: ContactLinksType = {
    telegram: {
        value: 'https://t.me/',
        prefix: '@'
    },
    whatsapp: {
        value: 'https://wa.me/',
        prefix: '@'
    },
    email: {
        value: 'mailto:',
    },
};
