import useUserStore from '~store/user.store';

import PersonalInfoSection from '~pageComponent/profile/section/personal-info';

export function meta() {
    return [{ title: 'Profile' }];
}

const Profile = () => {
    const { user } = useUserStore(state => state);

    return user && <PersonalInfoSection user={user} />;
};

export default Profile;
