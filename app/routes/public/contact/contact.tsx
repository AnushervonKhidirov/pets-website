import type { Route } from './+types/contact';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Contact page' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function Contact() {
    return <div>Contact page</div>;
}
