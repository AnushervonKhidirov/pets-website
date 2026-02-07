import type { Route } from './+types/home';

import Container from '~commons/container/container';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Home page' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {
    return (
        <Container>
            <div>Home page</div>
        </Container>
    );
}
