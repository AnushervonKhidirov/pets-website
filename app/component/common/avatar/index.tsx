import type { FC } from 'react';
import type { WithAdditionalProps } from '~type/common.type';

import { Avatar } from 'antd';
import { UserIcon } from '~icons';

import classNames from 'classnames';
import classes from './avatar.module.css';

type UserAvatarProps = WithAdditionalProps<{ firstName: string; lastName?: string | null }>;

const UserAvatar: FC<UserAvatarProps> = ({ firstName, lastName, className }) => {
    return (
        <div className={classNames(classes.avatar_wrapper, className)}>
            <Avatar
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
