import type { FC, PropsWithChildren } from 'react';
import type { WithClassName } from '~type/common.type';

import classNames from 'classnames';
import classes from './card.module.css';

type CardProps = PropsWithChildren<
    WithClassName & {
        shadow?: boolean;
        hoverable?: boolean;
        colored?: boolean;
    }
>;

const Card: FC<CardProps> = ({ shadow, hoverable, colored, className, children }) => {
    return (
        <div
            className={classNames(
                classes.card,
                { [classes.shadow]: shadow },
                { [classes.hoverable]: hoverable },
                { [classes.colored]: colored },
                className,
            )}
        >
            {children}
        </div>
    );
};

export default Card;
