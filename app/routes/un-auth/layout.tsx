import { useLayoutEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useUserInfo } from '~hook/use-user-info';

import { Header } from '~component/common';
import { Route } from '~constant/route';

export const Layout = () => {
    const navigate = useNavigate();
    const { query } = useUserInfo();

    useLayoutEffect(() => {
        if (query.isSuccess) navigate(Route.Home);
    }, [query]);

    return (
        !query.isSuccess && (
            <>
                <Header showAuthBtn={false} />
                <main>
                    <Outlet />
                </main>
            </>
        )
    );
};

export default Layout;
