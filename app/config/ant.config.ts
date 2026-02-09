import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
    token: {
        fontFamily: 'inherit',
        colorText: 'inherit',

        cyan: '#7ba99d',
        orange: '#bf6a2a',
    },
    components: {
        Modal: {
            colorTextHeading: '#303030',
            contentBg: '#fdf8f3',
            colorIcon: '#7ba99d',
            colorIconHover: '#7ba99d',
        },

        Button: {
            colorBgContainer: 'transparent',
        },
    },
};
