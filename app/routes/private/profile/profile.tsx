import type { Route } from './+types/profile';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Profile page' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function Profile() {
    return <div>Profile page</div>;
}
