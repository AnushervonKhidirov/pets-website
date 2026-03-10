import type { FC } from 'react';
import type { DropdownProps, MenuProps } from 'antd';
import type { User } from '~type/user.type';

import { useMutation } from '@tanstack/react-query';
import { useUserInfo } from '~hook/use-user-info';
import tokenService from '~service/token.service';
import authService from '~service/auth.service';

import { Link } from 'react-router';
import { Dropdown, Avatar } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { UserIcon, PawIcon } from '~icons';
import { Route } from '~constant/route';

import { cyan } from '~/config/ant.config';
import { isInPrivatePage } from '~helper/auth.helper';

const signOut = authService.signOut.bind(authService);

const ProfileButton: FC<{ user: User; className?: string }> = ({ user, className }) => {
    const { setData: setUser } = useUserInfo();

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
            onClick: () => mutate({ refreshToken: tokenService.getToken()?.refreshToken ?? null }),
        },
    ];

    const sharedProps: DropdownProps = {
        menu: { items },
        placement: 'bottomLeft',
        trigger: ['click'],
        styles: { item: { fontSize: '1em' } },
    };

    const { mutate } = useMutation({
        mutationKey: ['log_out'],
        mutationFn: signOut,
        onSettled: () => {
            tokenService.removeToken();
            setUser(null);
            if (isInPrivatePage()) globalThis.location.replace(Route.SignIn);
        },
    });

    return (
        <Dropdown {...sharedProps}>
            <Avatar
                src={user?.avatar}
                icon={<UserIcon />}
                size="large"
                className={className}
                style={{ backgroundColor: cyan[5], cursor: 'pointer' }}
            />
        </Dropdown>
    );
};

export default ProfileButton;
