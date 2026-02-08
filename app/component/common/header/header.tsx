import type { NavLinkRenderProps } from 'react-router';

import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Route } from '~/constant/route';

import Container from '~commons/container/container';
import Logo from '~commons/logo/logo';
import Button from '~commons/button/button';
import { Paw } from '~icons/icons';

import classNames from 'classnames';
import classes from './header.module.css';

const Header = () => {
    const menuRef = useRef<HTMLDivElement>(null);
    const menuInnerRef = useRef<HTMLDivElement>(null);
    const [menuOpened, setMenuOpened] = useState(false);

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
                            <NavLink
                                onClick={() => setMenuOpened(false)}
                                to={Route.Home}
                                className={getClassName}
                            >
                                Главная
                            </NavLink>
                            <NavLink
                                onClick={() => setMenuOpened(false)}
                                to={Route.Lost}
                                className={getClassName}
                            >
                                Потеряшки
                            </NavLink>
                            <NavLink
                                onClick={() => setMenuOpened(false)}
                                to={Route.VetClinic}
                                className={getClassName}
                            >
                                Клиники
                            </NavLink>
                            <NavLink
                                onClick={() => setMenuOpened(false)}
                                to={Route.ContactUs}
                                className={getClassName}
                            >
                                Связаться с нами
                            </NavLink>
                        </nav>

                        <Button className={classes.auth_btn} icon={<Paw />} href={Route.SignIn}>
                            Войти
                        </Button>
                    </div>
                </div>

                <button className={classes.menu_icon} onClick={menuHandler}>
                    {menuOpened ? <CloseOutlined /> : <MenuOutlined />}
                </button>
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
