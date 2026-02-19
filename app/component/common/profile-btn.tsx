import type { FC } from 'react';
import type { DropdownProps, MenuProps } from 'antd';

import tokenService from '~service/token.service';
import authService from '~service/auth.service';
import useUserStore from '~store/user.store';

import { Link } from 'react-router';
import { Dropdown, Avatar } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { UserIcon, PawIcon } from '~icons';
import { Route } from '~constant/route';

import { cyan } from '~/config/ant.config';
import { isInPrivatePage } from '~helper/auth.helper';

const ProfileButton: FC<{ className?: string }> = props => {
    const { user, clearUserData } = useUserStore(state => state);

    const items: MenuProps['items'] = [
        {
            key: 'Профиль',
            label: <Link to={Route.Profile}>Профиль</Link>,
            icon: <UserIcon style={{ fontSize: '1em' }} />,
        },
        {
            key: 'Мои питомцы',
            label: <Link to={Route.MyPets}>Мои питомцы</Link>,
            icon: <PawIcon style={{ fontSize: '1em' }} />,
        },
        {
            type: 'divider',
        },
        {
            key: 'Выйти',
            label: 'Выйти',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => logOut(),
        },
    ];

    const sharedProps: DropdownProps = {
        menu: { items },
        placement: 'bottomLeft',
        trigger: ['click'],
        styles: { item: { fontSize: '1em' } },
    };

    async function logOut(allDevices: boolean = false) {
        const token = tokenService.getToken();

        if (token) await authService.signOut({ refreshToken: token.refreshToken }, allDevices);
        tokenService.removeToken();
        clearUserData();
        if (isInPrivatePage()) globalThis.location.replace('/');
    }

    return (
        <Dropdown {...sharedProps}>
            <Avatar
                src={user?.avatar}
                icon={<UserIcon />}
                size="large"
                className={props.className}
                style={{ backgroundColor: cyan[5], cursor: 'pointer' }}
            />
        </Dropdown>
    );
};

export default ProfileButton;
