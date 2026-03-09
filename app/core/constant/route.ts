export enum Route {
    Home = '/',
    Lost = '/lost',
    VetClinic = '/vet-clinic',
    ContactUs = '/contact-us',
    PetInfo = '/pet',

    Profile = '/profile',
    ProfileSetting = '/profile/setting',
    MyPet = '/profile/pet',
    MyPets = '/profile/pets',

    OAuthGoogle = '/auth/google',

    SignIn = '/sign-in',
    SignUp = '/sign-up',
    ResetPassword = '/reset-password',
}

export const PrivateRoutes = [Route.Profile];
