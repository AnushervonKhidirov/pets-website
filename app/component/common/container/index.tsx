import type { CSSProperties, FC } from 'react';
import type { BackgroundProps } from '../background';

import Background from '../background';

import { lightGray } from '~/config/ant.config';
import classNames from 'classnames';
import classes from './container.module.css';

type ContainerProps = BackgroundProps<{
    section?: boolean;
    innerClassName?: string;
    maxWidth?: number;
    styles?: { wrapper?: CSSProperties; content?: CSSProperties };
}>;

const Container: FC<ContainerProps> = ({
    section,
    className,
    innerClassName,
    maxWidth = 1200,
    children,
    color = lightGray,
    styles = {},
    ...props
}) => {
    return (
        <Background
            className={classNames(classes.container, { [classes.section]: section }, className)}
            color={color}
            {...props}
            style={{
                ...props.style,
                ...styles.wrapper,
            }}
        >
            <div
                className={classNames(classes.container_inner, innerClassName)}
                style={{ maxWidth, ...styles.content }}
            >
                {children}
            </div>
        </Background>
    );
};

export default Container;
