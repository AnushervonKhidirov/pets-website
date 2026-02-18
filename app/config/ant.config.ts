import type { ThemeConfig } from 'antd';
import { grey, generate } from '@ant-design/colors';

export const cyan = generate('#7ba99d');
export const orange = generate('#bf6a2a');
export const light = '#fdf8f3';

export const themeConfig: ThemeConfig = {
    cssVar: { key: 'custom-ant', prefix: '' },

    token: {
        fontFamily: 'inherit',
        colorText: 'inherit',
        colorTextHeading: grey[6],
        fontSize: 16,

        cyan: cyan[5],
        orange: orange[5],
    },
    components: {
        Typography: {
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
            titleFontSize: 28,
            contentBg: orange[0],
            colorIcon: cyan[5],
            colorIconHover: cyan[5],
        },

        Form: {
            itemMarginBottom: 10,
        },

        Button: {
            colorBgContainer: 'transparent',
            colorBgSolid: grey[6],
            colorBgSolidHover: grey[5],
            colorBgSolidActive: grey[7],

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
            itemPaddingBottom: 5,
        },
    },
};
