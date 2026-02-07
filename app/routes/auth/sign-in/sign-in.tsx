import type { Route } from './+types/sign-in';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'SignIn page' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function SignIn() {
    return <div>SignIn page</div>;
}
