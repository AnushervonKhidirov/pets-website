import type { Route } from './+types/lost';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Lost page' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Lost() {
    return <div>Lost page</div>;
}
