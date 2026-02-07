import type { FC, PropsWithChildren } from 'react';
import type { WithClassName } from '~type/common.type';

import classNames from 'classnames';
import classes from './container.module.css';

type ContainerProps = PropsWithChildren<WithClassName & { innerClassName?: string }>;

const Container: FC<ContainerProps> = ({ children, className, innerClassName }) => {
    return (
        <div className={classNames(classes.container, className)}>
            <div className={classNames(classes.container_inner, innerClassName)}>{children}</div>
        </div>
    );
};

export default Container;
