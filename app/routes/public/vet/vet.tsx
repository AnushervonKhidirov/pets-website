import type { Route } from "./+types/vet";

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Vet page' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Vet() {
    return <div>Vet page</div>;
}
