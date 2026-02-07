import type { NavLinkRenderProps } from 'react-router';

import { NavLink } from 'react-router';
import { Route } from '~/constant/route';

import { isMobile } from 'mobile-device-detect';

import Container from '~commons/container/container';
import Logo from '~commons/logo/logo';
import Button from '~commons/button/button';
import { Paw } from '~icons/paw';

import classNames from 'classnames';
import classes from './header.module.css';

const Header = () => {
    console.log(isMobile);

    return (
        <header className={classes.header}>
            <Container innerClassName={classes.header_inner}>
                <Logo className={classes.logo} />

                {isMobile ? <MobileNav /> : <DesktopNav />}
            </Container>
        </header>
    );
};

const MobileNav = () => {
    return (
        <>
            <div className="menu_icon">menu icon</div>
        </>
    );
};

const DesktopNav = () => {
    return (
        <>
            <nav className={classes.nav_bar}>
                <NavLink to={Route.Home} className={getClassName}>
                    Главная
                </NavLink>
                <NavLink to={Route.Lost} className={getClassName}>
                    Потеряшки
                </NavLink>
                <NavLink to={Route.VetClinic} className={getClassName}>
                    Клиники
                </NavLink>
                <NavLink to={Route.ContactUs} className={getClassName}>
                    Связаться с нами
                </NavLink>
            </nav>

            <Button className={classes.auth_btn} fullRounded icon={<Paw />}>
                Войти
            </Button>
        </>
    );
};

function getClassName({ isActive }: NavLinkRenderProps): string {
    return classNames(classes.nav_link, {
        [classes.active]: isActive,
    });
}

export default Header;
