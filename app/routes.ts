import type { RouteConfig } from '@react-router/dev/routes';
import { index, route, layout } from '@react-router/dev/routes';
import { Route } from './constant/route';

export default [
    layout('routes/public/layout.tsx', [
        index('routes/public/home/home.tsx'),
        route(Route.Lost, 'routes/public/lost/lost.tsx'),
        route(Route.VetClinic, 'routes/public/vet/vet.tsx'),
        route(Route.ContactUs, 'routes/public/contact/contact.tsx'),
    ]),

    layout('routes/auth/layout.tsx', [
        route(Route.SignIn, 'routes/auth/sign-in/sign-in.tsx'),
        route(Route.SignUp, 'routes/auth/sign-up/sign-up.tsx'),
    ]),

    layout('routes/private/layout.tsx', [
        route(Route.Profile, 'routes/private/profile/profile.tsx'),
    ]),
] satisfies RouteConfig;
