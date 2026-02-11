import { Outlet } from 'react-router';
import { useAuth } from '~hook/use-auth';

import Header from '~commons/header/header';
import Footer from '~commons/footer/footer';

import userService from '~service/user.service';
import useUserStore from '~/core/store/user.store';

export const Layout = () => {
    const { update } = useUserStore(state => state);

    async function fetchUserData() {
        const [user, err] = await userService.getMe();
        if (err) return;
        update(user);
    }

    useAuth(() => {
        fetchUserData();
    });

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
