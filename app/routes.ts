import type { RouteConfig } from '@react-router/dev/routes';
import { index, route, layout } from '@react-router/dev/routes';
import { Route } from './core/constant/route';

export default [
    layout('routes/public/layout.tsx', [
        index('routes/public/home.page.tsx'),
        route(Route.Lost, 'routes/public/lost.page.tsx'),
        route(Route.VetClinic, 'routes/public/vet.page.tsx'),
        route(Route.ContactUs, 'routes/public/contact.page.tsx'),
    ]),

    layout('routes/private/layout.tsx', [
        route(Route.Profile, 'routes/private/profile.page.tsx'),
        route(Route.MyPets, 'routes/private/my-pets.page.tsx'),
    ]),

    route(Route.OAuthGoogle, 'routes/oauth/oauth-google.page.tsx'),
] satisfies RouteConfig;
