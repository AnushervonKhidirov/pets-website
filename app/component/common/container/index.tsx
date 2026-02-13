import type { FC, PropsWithChildren } from 'react';
import type { WithClassName } from '~type/common.type';

import classNames from 'classnames';
import classes from './container.module.css';

type ContainerProps = PropsWithChildren<
    WithClassName & { innerClassName?: string; section?: boolean; colored?: boolean }
>;

const Container: FC<ContainerProps> = ({
    section,
    colored,
    children,
    className,
    innerClassName,
}) => {
    return (
        <div
            className={classNames(
                classes.container,
                { [classes.colored]: colored },
                { [classes.section]: section },
                className,
            )}
        >
            <div className={classNames(classes.container_inner, innerClassName)}>{children}</div>
        </div>
    );
};

export default Container;
