export enum ContactName {
    Telegram = 'Telegram',
    WhatsApp = 'WhatsApp',
}

export type ContactLinksType =
    | Partial<Record<Lowercase<ContactName>, string>>
    | Record<string, string>;

export const ContactLinks: ContactLinksType = {
    telegram: 'https://t.me/',
    whatsapp: 'https://wa.me/',
    email: 'mailto:',
};
