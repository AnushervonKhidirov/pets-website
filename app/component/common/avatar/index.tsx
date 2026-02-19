import type { FC } from 'react';
import type { WithAdditionalProps } from '~type/common.type';
import type { User } from '~type/user.type';

import { Avatar } from 'antd';
import { UserIcon } from '~icons';

import classNames from 'classnames';
import classes from './avatar.module.css';

type UserAvatarProps = WithAdditionalProps<Pick<User, 'avatar' | 'firstName' | 'lastName'>>;

const UserAvatar: FC<UserAvatarProps> = ({ firstName, lastName, avatar, className }) => {
    return (
        <div className={classNames(classes.avatar_wrapper, className)}>
            <Avatar
                src={avatar}
                icon={<UserIcon />}
                size={45}
                style={{ fontSize: '1.75rem' }}
                className={classes.avatar}
            />

            <div className={classes.firstName}>{firstName}</div>
            {lastName && <div className={classes.lastName}>{lastName}</div>}
        </div>
    );
};

export default UserAvatar;
