import { useLayoutEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '~hook/use-auth';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import { Header } from '~component/common';
import { isAuthorized } from '~helper/auth.helper';
import { Route } from '~constant/route';

const getUserInfo = userService.getMe.bind(userService);

export const Layout = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUserStore(state => state);

    const { mutate } = useMutation({
        mutationKey: ['get_user_info_private'],
        mutationFn: getUserInfo,
        onSuccess: setUser,
    });

    useLayoutEffect(() => {
        if (!isAuthorized()) navigate(Route.SignIn);
    }, []);

    useAuth(() => {
        if (!user) mutate();
    });

    return (
        user && (
            <>
                <Header />
                <main>
                    <Outlet />
                </main>
            </>
        )
    );
};

export default Layout;
