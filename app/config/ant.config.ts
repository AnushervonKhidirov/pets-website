import type { ThemeConfig } from 'antd';
import { grey, generate } from '@ant-design/colors';

const cyan = generate('#7ba99d');
const orange = generate('#bf6a2a');
const red = generate('#d0463b');

export const themeConfig: ThemeConfig = {
    token: {
        fontFamily: 'inherit',
        colorText: 'inherit',

        cyan: cyan[5],
        orange: orange[5],
        red: red[5],
        fontSize: 16,
    },
    components: {
        Typography: {
            colorTextHeading: grey[6],
            lineHeightHeading1: 1,
            lineHeightHeading2: 1,
            lineHeightHeading3: 1,
            lineHeightHeading4: 1,
            lineHeightHeading5: 1,
            lineHeight: 1.5,
            titleMarginBottom: 0,
            titleMarginTop: 0,
        },

        Modal: {
            colorTextHeading: grey[6],
            titleFontSize: 28,
            contentBg: '#fdf8f3',
            colorIcon: cyan[5],
            colorIconHover: cyan[5],
        },

        Form: {
            itemMarginBottom: 10,
        },

        Button: {
            colorBgContainer: 'transparent',

            contentFontSizeSM: 12,
            controlHeightSM: 26,
            paddingInlineSM: '1em',

            controlHeight: 36,
            paddingInline: '1.25em',

            contentFontSizeLG: 20,
            controlHeightLG: 60,
            paddingInlineLG: '1.5em',
        },

        Input: {
            activeBorderColor: cyan[5],
            hoverBorderColor: cyan[4],
        },

        Descriptions: {
            titleColor: grey[6],
        },
    },
};
