import type { FC, MouseEvent, PropsWithChildren, ReactNode } from 'react';
import type { WithClassName } from '~type/common.type';
import type { To } from 'react-router';

import { Link } from 'react-router';
import { LoadingOutlined } from '@ant-design/icons';

import classNames from 'classnames';
import classes from './button.module.css';

type ButtonProps = PropsWithChildren<WithClassName & ButtonSpecificProps>;

type ButtonSpecificProps = {
    type?: 'primary' | 'outlined';
    color?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    icon?: ReactNode;
    loading?: boolean;
    href?: To;
    onClick?: (e: MouseEvent) => void;
};

const Button: FC<ButtonProps> = ({
    type = 'primary',
    color = 'primary',
    size = 'medium',
    icon,
    loading,
    href,
    className,
    children,
    onClick,
}) => {
    const ButtonTag = href ? Link : 'button';
    const showIcon = icon || loading;

    function onClickHandler(e: MouseEvent) {
        e.preventDefault();
        if (typeof onClick === 'function') onClick(e);
    }

    return (
        <ButtonTag
            to={href ?? ''}
            className={classNames(
                classes.button,
                classes[type],
                classes[color + '-color'],
                classes[size],
                className,
            )}
            onClick={onClickHandler}
        >
            {showIcon && (
                <div className={classes.icon}>
                    {icon && !loading && icon}
                    {loading && <LoadingOutlined />}
                </div>
            )}

            <div className={classes.text}>{children}</div>
        </ButtonTag>
    );
};

export default Button;
