import type { Route } from './+types/sign-up';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'SignUp page' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function SignUp() {
    return <div>SignUp page</div>;
}
