import type { FC } from 'react';
import type { WithAdditionalProps } from '~type/common.type';

import logo from 'src/images/logo/logo.png';
import logo_100 from 'src/images/logo/logo-100x100.png';
import logo_200 from 'src/images/logo/logo-200x200.png';
import logo_300 from 'src/images/logo/logo-300x300.png';

type LogoProps = WithAdditionalProps<{ size?: Size }>;
type Size = 'small' | 'medium' | 'large' | 'extraLarge';

const Logo: FC<LogoProps> = ({ size = 'medium', className, style }) => {
    const logoVersions: Record<Size, string> = {
        small: logo_100,
        medium: logo_200,
        large: logo_300,
        extraLarge: logo,
    };

    return <img src={logoVersions[size]} alt="logo" style={style} className={className} />;
};

export default Logo;
