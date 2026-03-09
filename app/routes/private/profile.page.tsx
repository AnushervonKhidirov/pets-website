import { useUserInfo } from '~hook/use-user-info';

import PersonalInfoSection from '~component/profile/personal-info';

export function meta() {
    return [{ title: 'Профиль' }];
}

const Profile = () => {
    const { query } = useUserInfo();
    return query.isSuccess && <PersonalInfoSection user={query.data} />;
};

export default Profile;
