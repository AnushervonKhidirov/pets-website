export enum Route {
    Home = '/',
    Lost = '/lost',
    VetClinic = '/vet-clinic',
    ContactUs = '/contact-us',

    Profile = '/profile',

    OAuthGoogle = '/auth/google',
}

export const PrivateRoutes = [Route.Profile];
