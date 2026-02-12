export enum ContactName {
    Telegram = 'Telegram',
    WhatsApp = 'WhatsApp',
}

export const ContactLinks: Record<Lowercase<ContactName>, string | null> = {
    telegram: 'https://t.me/',
    whatsapp: 'https://wa.me/',
};

export function isContactItem(name: string): name is ContactName {
    const contactNames = Object.values(ContactName) as string[];
    return contactNames.includes(name);
}
