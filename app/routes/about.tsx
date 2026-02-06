import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'About page' }];
}

export default function About() {
    return <div>About page</div>;
}
