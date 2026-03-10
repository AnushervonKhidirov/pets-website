import type { FC } from 'react';
import type { NavLinkRenderProps } from 'react-router';
import type { ButtonProps } from 'antd';
import type { User } from '~type/user.type';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useUserInfo } from '~hook/use-user-info';
import { Link, NavLink } from 'react-router';
import { isInPrivatePage } from '~helper/auth.helper';

import tokenService from '~service/token.service';
import authService from '~service/auth.service';

import { Button, Drawer } from 'antd';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { PawIcon, UserIcon } from '~icons';
import { Container, Logo } from '~component/common';
import ProfileButton from '../profile-btn';

import { isMobile, isTablet } from 'mobile-device-detect';
import { Route } from '~constant/route';
import { light } from '~/config/ant.config';
import classNames from 'classnames';
import classes from './header.module.css';

const signOut = authService.signOut.bind(authService);

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

const Header = ({ showAuthBtn = true }: { showAuthBtn?: boolean }) => {
    const { query } = useUserInfo();
    const [menuOpened, setMenuOpened] = useState(false);

    function openDrawer() {
        history.pushState({ action: closeModalAction }, '');
        setMenuOpened(true);
    }

    function closeDrawer(back: boolean = false) {
        if (!menuOpened) return;
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

                            {showAuthBtn && (
                                <DrawerFooter user={query.data} closeDrawer={closeDrawer} />
                            )}
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
                footer={<DrawerFooter user={query.data} isMobile closeDrawer={closeDrawer} />}
                extra={query.data && <ProfileButton user={query.data} />}
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

const DrawerFooter: FC<{
    user?: User | null;
    isMobile?: boolean;
    closeDrawer: (back?: boolean) => void;
}> = ({ user, isMobile = false, closeDrawer }) => {
    const { setData } = useUserInfo();

    const signInProps: ButtonProps = {
        className: classNames(classes.sign_in_btn, { [classes.sign_in_btn_mobile]: isMobile }),
        block: true,
        icon: <PawIcon />,
        variant: 'solid',
        color: 'cyan',
    };

    const { mutate } = useMutation({
        mutationKey: ['log_out'],
        mutationFn: signOut,
        onSettled: () => {
            tokenService.removeToken();
            setData(null);
            closeDrawer();
            if (isInPrivatePage()) globalThis.location.replace(Route.SignIn);
        },
    });

    if (!user)
        return (
            <Link to={Route.SignIn} onClick={closeDrawer.bind(null, false)}>
                <Button {...signInProps}>Войти</Button>
            </Link>
        );
    if (user && !isMobile) return <ProfileButton user={user} className={classes.profile_btn} />;

    return (
        <div style={{ display: 'grid', gap: '0.5rem', marginBlock: '1rem 2rem' }}>
            <Link to={Route.Profile} onClick={closeDrawer.bind(null, false)}>
                <Button color="cyan" variant="filled" block icon={<UserIcon />}>
                    Профиль
                </Button>
            </Link>

            <Link to={Route.MyPets} onClick={closeDrawer.bind(null, false)}>
                <Button color="cyan" variant="filled" block icon={<PawIcon />}>
                    Мои питомцы
                </Button>
            </Link>

            <Button
                type="primary"
                danger
                block
                icon={<LogoutOutlined />}
                onClick={() =>
                    mutate({ refreshToken: tokenService.getToken()?.refreshToken ?? null })
                }
            >
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
