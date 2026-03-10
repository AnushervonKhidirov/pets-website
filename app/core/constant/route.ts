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
    MyPetSetting = '/profile/pet/setting',
    CreatePet = '/profile/pet/create',

    OAuthGoogle = '/auth/google',

    SignIn = '/sign-in',
    SignUp = '/sign-up',
    ResetPassword = '/reset-password',
}

export const PrivateRoutes = [Route.Profile];
