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
};

export function isContactItem(name: string): name is ContactName {
    const contactNames = Object.values(ContactName) as string[];
    return contactNames.includes(name);
}
