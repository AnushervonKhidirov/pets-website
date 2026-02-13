import type { FC } from 'react';
import type { WithAdditionalProps } from '~type/common.type';

import logo from 'src/images/logo/logo.png';
import logo_100 from 'src/images/logo/logo-100x100.png';
import logo_200 from 'src/images/logo/logo-200x200.png';
import logo_300 from 'src/images/logo/logo-300x300.png';

import classNames from 'classnames';
import classes from './logo.module.css';

type LogoProps = WithAdditionalProps<{ logoSize?: logoSize }>;
type logoSize = 'small' | 'medium' | 'large' | 'extraLarge';

const Logo: FC<LogoProps> = ({ logoSize = 'small', className }) => {
    const logoVersions: Record<logoSize, string> = {
        small: logo_100,
        medium: logo_200,
        large: logo_300,
        extraLarge: logo,
    };

    return (
        <div className={classNames(classes.logo, className)}>
            <img src={logoVersions[logoSize]} alt="logo" />
            <div className={classes.name}>
                Home<span>Paw</span>
            </div>
        </div>
    );
};

export default Logo;
