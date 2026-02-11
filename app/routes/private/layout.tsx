import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '~hook/use-auth';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import Header from '~commons/header/header';
import { isLoggedIn } from '~helper/auth.helper';

export const Layout = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUserStore(state => state);

    async function fetchUserData() {
        const [user, err] = await userService.getMe();
        if (err) return;
        setUser(user);
    }

    useEffect(() => {
        if (!isLoggedIn()) navigate('/');
    }, []);

    useAuth(() => {
        if (!user) fetchUserData();
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
