export enum Route {
    Home = '/',
    Lost = '/lost',
    VetClinic = '/vet-clinic',
    ContactUs = '/contact-us',
    PetInfo = '/pet',

    Profile = '/profile',
    MyPet = '/profile/pet',
    MyPets = '/profile/pets',

    OAuthGoogle = '/auth/google',
}

export const PrivateRoutes = [Route.Profile];
