export enum Route {
    Home = '/',
    Lost = '/lost',
    VetClinic = '/vet-clinic',
    ContactUs = '/contact-us',
    PetInfo = '/pet',

    Profile = '/profile',
    MyPets = '/profile/pets',

    OAuthGoogle = '/auth/google',
}

export const PrivateRoutes = [Route.Profile];
