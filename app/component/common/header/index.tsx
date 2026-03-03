import type { FC } from 'react';
import type { NavLinkRenderProps } from 'react-router';
import type { ButtonProps } from 'antd';
import type { User } from '~type/user.type';

import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import useUserStore from '~store/user.store';
import { isAuthorized, isInPrivatePage } from '~helper/auth.helper';

import tokenService from '~service/token.service';
import authService from '~service/auth.service';

import { Button, Drawer } from 'antd';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { PawIcon, UserIcon } from '~icons';
import { Container, Logo } from '~component/common';
import AuthButton from '~component/auth/auth-button';
import ProfileButton from '../profile-btn';

import { isMobile, isTablet } from 'mobile-device-detect';
import { Route } from '~constant/route';
import { light } from '~/config/ant.config';
import classNames from 'classnames';
import classes from './header.module.css';

const navLinkList = [
    {
        to: Route.Home,
        name: 'Главная',
    },
    {
        to: Route.Lost,
        name: 'Потерянные',
    },
    {
        to: Route.VetClinic,
        name: 'Клиники',
    },
    {
        to: Route.ContactUs,
        name: 'Связаться с нами',
    },
];

const isMobileDevice = isMobile || isTablet;
const closeModalAction = 'close-modal';

const Header = () => {
    const { user } = useUserStore(state => state);
    const [menuOpened, setMenuOpened] = useState(false);

    function openDrawer() {
        history.pushState({ action: closeModalAction }, '');
        setMenuOpened(true);
    }

    function closeDrawer(back: boolean = false) {
        if (back && history.state.action === closeModalAction) history.back();
        setMenuOpened(false);
    }

    const closeOnBack = closeDrawer.bind(null, true);

    useEffect(() => {
        globalThis.addEventListener('popstate', closeOnBack);

        return () => {
            globalThis.removeEventListener('popstate', closeOnBack);
        };
    }, []);

    return (
        <header className={classes.header}>
            <Container innerClassName={classes.header_inner} color={light} alpha={0.8} blur={8}>
                <Logo className={classes.logo} />

                {!isMobileDevice && (
                    <div
                        className={classNames(classes.menu_wrapper, {
                            [classes.opened]: menuOpened,
                        })}
                    >
                        <div className={classes.menu_inner}>
                            <nav className={classes.nav_bar}>
                                {navLinkList.map(({ name, to }) => (
                                    <NavLink key={to + name} to={to} className={getClassName}>
                                        {name}
                                    </NavLink>
                                ))}
                            </nav>

                            <DrawerFooter user={user} />
                        </div>
                    </div>
                )}

                {isMobileDevice && (
                    <Button
                        color="cyan"
                        variant="filled"
                        className={classes.menu_icon}
                        onClick={openDrawer}
                        icon={<MenuOutlined />}
                    />
                )}
            </Container>

            <Drawer
                title="Меню"
                destroyOnHidden
                open={menuOpened}
                onClose={closeOnBack}
                footer={<DrawerFooter user={user} isMobile />}
                extra={user && <ProfileButton user={user} />}
                size={300}
                styles={{
                    section: { backgroundColor: light },
                }}
            >
                <nav className={classes.nav_bar}>
                    {navLinkList.map(({ name, to }) => (
                        <NavLink
                            key={to + name}
                            to={to}
                            onClick={closeDrawer.bind(null, false)}
                            className={getClassName}
                        >
                            {name}
                        </NavLink>
                    ))}
                </nav>
            </Drawer>
        </header>
    );
};

const DrawerFooter: FC<{ user: User | null; isMobile?: boolean }> = ({
    user,
    isMobile = false,
}) => {
    const { clearUserData } = useUserStore(state => state);
    const isLogged = isAuthorized() || user;

    const signInProps: ButtonProps = {
        className: classNames(classes.sign_in_btn, { [classes.sign_in_btn_mobile]: isMobile }),
        block: true,
        icon: <PawIcon />,
        variant: 'solid',
        color: 'cyan',
    };

    async function logOut(allDevices: boolean = false) {
        const token = tokenService.getToken();

        if (token) await authService.signOut({ refreshToken: token.refreshToken }, allDevices);
        tokenService.removeToken();
        clearUserData();
        if (isInPrivatePage()) globalThis.location.replace('/');
    }

    if (!user || !isLogged) return <AuthButton {...signInProps} />;
    if (user && !isMobile) return <ProfileButton user={user} className={classes.profile_btn} />;

    return (
        <div style={{ display: 'grid', gap: '0.5rem', marginBlock: '1rem 2rem' }}>
            <Link to={Route.Profile}>
                <Button color="cyan" variant="filled" block icon={<UserIcon />}>
                    Профиль
                </Button>
            </Link>

            <Link to={Route.MyPets}>
                <Button color="cyan" variant="filled" block icon={<PawIcon />}>
                    Мои питомцы
                </Button>
            </Link>

            <Button type="primary" danger block icon={<LogoutOutlined />} onClick={() => logOut()}>
                Выйти
            </Button>
        </div>
    );
};

function getClassName({ isActive }: NavLinkRenderProps): string {
    return classNames(classes.nav_link, {
        [classes.active]: isActive,
    });
}

export default Header;
