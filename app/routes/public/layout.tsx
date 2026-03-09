import { Outlet } from 'react-router';
import { Header } from '~component/common';

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
