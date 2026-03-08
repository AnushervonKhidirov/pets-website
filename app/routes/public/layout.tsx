import { Outlet } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '~hook/use-auth';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import { Header } from '~component/common';

const getUserInfo = userService.getMe.bind(userService);

export const Layout = () => {
    const { user, setUser } = useUserStore(state => state);

    const { mutate } = useMutation({
        mutationKey: ['get_user_info_public'],
        mutationFn: getUserInfo,
        onSuccess: setUser,
    });

    useAuth(() => {
        if (!user) mutate();
    });

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
