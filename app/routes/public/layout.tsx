import { Outlet } from 'react-router';

import Header from '~commons/header/header';
import Footer from '~commons/footer/footer';

export const Layout = () => {
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
