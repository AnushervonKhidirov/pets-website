import type { FC } from 'react';
import type { BackgroundProps } from '../background';

import Background from '../background';
import classNames from 'classnames';
import classes from './container.module.css';

type ContainerProps = BackgroundProps<{
    section?: boolean;
    innerClassName?: string;
    maxWidth?: number;
}>;

const Container: FC<ContainerProps> = ({
    section,
    className,
    innerClassName,
    maxWidth = 1200,
    children,
    ...props
}) => {
    return (
        <Background
            className={classNames(classes.container, { [classes.section]: section }, className)}
            {...props}
        >
            <div
                className={classNames(classes.container_inner, innerClassName)}
                style={{ maxWidth }}
            >
                {children}
            </div>
        </Background>
    );
};

export default Container;
