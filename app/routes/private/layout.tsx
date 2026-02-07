import { Outlet } from 'react-router';

import Header from '~commons/header/header';

export const Layout = () => {
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
