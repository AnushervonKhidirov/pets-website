import { Outlet } from 'react-router';
import { useAuth } from '~hook/use-auth';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import Header from '~commons/header/header';

export const Layout = () => {
    const { user, update } = useUserStore(state => state);

    async function fetchUserData() {
        const [user, err] = await userService.getMe();
        if (err) return;
        update(user);
    }

    useAuth(() => {
        if (!user) fetchUserData();
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
