import type { NavLinkRenderProps } from 'react-router';
import type { ButtonProps } from 'antd';

import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router';
import useUserStore from '~store/user.store';
import { isLoggedIn } from '~helper/auth.helper';

import { Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import Container from '~commons/container/container';
import AuthButton from '~component/auth/auth-button';
import Logo from '~commons/logo/logo';
import { PawIcon } from '~icons/icons';

import { Route } from '~constant/route';
import classNames from 'classnames';
import classes from './header.module.css';

const navLinkList = [
    {
        to: Route.Home,
        name: 'Главная',
    },
    {
        to: Route.Lost,
        name: 'Потеряшки',
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

const Header = () => {
    const menuRef = useRef<HTMLDivElement>(null);
    const menuInnerRef = useRef<HTMLDivElement>(null);
    const { user } = useUserStore(state => state);
    const [menuOpened, setMenuOpened] = useState(false);

    const headerButtonProps: ButtonProps = {
        className: classes.auth_btn,
        block: true,
        icon: <PawIcon />,
        variant: 'solid',
        color: 'cyan',
    };

    const HeaderButton =
        isLoggedIn() || user ? (
            <Link to={Route.Profile}>
                <Button {...headerButtonProps}>Профиль</Button>
            </Link>
        ) : (
            <AuthButton {...headerButtonProps} />
        );

    function menuHandler() {
        setMenuOpened(prevState => !prevState);
    }

    useEffect(() => {
        if (menuRef.current && menuInnerRef.current) {
            const menu = menuRef.current;
            const menuInner = menuInnerRef.current;
            menu.style.setProperty('--height', `${menuInner.offsetHeight}px`);
        }
    }, [menuRef.current, menuInnerRef.current, window.innerWidth]);

    return (
        <header className={classes.header}>
            <Container innerClassName={classes.header_inner}>
                <Logo className={classes.logo} />

                <div
                    ref={menuRef}
                    className={classNames(classes.menu_wrapper, { [classes.opened]: menuOpened })}
                >
                    <div ref={menuInnerRef} className={classes.menu_inner}>
                        <nav className={classes.nav_bar}>
                            {navLinkList.map(({ name, to }) => (
                                <NavLink
                                    key={to + name}
                                    to={to}
                                    onClick={() => setMenuOpened(false)}
                                    className={getClassName}
                                >
                                    {name}
                                </NavLink>
                            ))}
                        </nav>

                        {HeaderButton}
                    </div>
                </div>

                <Button
                    color="cyan"
                    variant="filled"
                    className={classes.menu_icon}
                    onClick={menuHandler}
                    icon={menuOpened ? <CloseOutlined /> : <MenuOutlined />}
                ></Button>
            </Container>
        </header>
    );
};

function getClassName({ isActive }: NavLinkRenderProps): string {
    return classNames(classes.nav_link, {
        [classes.active]: isActive,
    });
}

export default Header;
