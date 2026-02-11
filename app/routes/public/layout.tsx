import { Outlet } from 'react-router';
import { useAuth } from '~hook/use-auth';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import Header from '~commons/header/header';
import Footer from '~commons/footer/footer';

export const Layout = () => {
    const { user, setUser } = useUserStore(state => state);

    async function fetchUserData() {
        const [user, err] = await userService.getMe();
        if (err) return;
        setUser(user);
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
            <Footer />
        </>
    );
};

export default Layout;
