import type { RouteConfig } from '@react-router/dev/routes';
import { index, route, layout } from '@react-router/dev/routes';
import { Route } from './core/constant/route';

export default [
    layout('routes/public/layout.tsx', [
        index('routes/public/home.page.tsx'),
        route(Route.Lost, 'routes/public/lost.page.tsx'),
        route(Route.VetClinic, 'routes/public/vet-clinic.page.tsx'),
        route(Route.ContactUs, 'routes/public/contact.page.tsx'),
        route(Route.PetInfo + '/:petId', 'routes/public/pet-info.page.tsx'),
        route(Route.ResetPassword + '/:passwordId', 'routes/public/reset-password.page.tsx'),
    ]),

    layout('routes/un-auth/layout.tsx', [
        route(Route.SignIn, 'routes/un-auth/sign-in.page.tsx'),
        route(Route.SignUp, 'routes/un-auth/sign-up.page.tsx'),
    ]),

    layout('routes/private/layout.tsx', [
        route(Route.Profile, 'routes/private/profile/index.tsx'),
        route(Route.ProfileSetting, 'routes/private/profile-setting/index.tsx'),
        route(Route.MyPets, 'routes/private/my-pets/index.tsx'),
        route(Route.MyPet + '/:petId', 'routes/private/my-pet.page.tsx'),
    ]),

    route(Route.OAuthGoogle, 'routes/oauth/oauth-google.page.tsx'),
] satisfies RouteConfig;
