import type { FC } from 'react';
import type { GetProps } from 'antd';

import Icon from '@ant-design/icons';

type CustomIconProps = { strokeWidth?: number };
type IconProps = Partial<GetProps<typeof Icon> & { strokeWidth?: number }>;

const Paw: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <circle cx="11" cy="4" r="2"></circle>
            <circle cx="18" cy="8" r="2"></circle>
            <circle cx="20" cy="16" r="2"></circle>
            <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"></path>
        </svg>
    );
};

const User: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );
};

const Users: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <circle cx="9" cy="7" r="4"></circle>
        </svg>
    );
};

const Search: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
        </svg>
    );
};

const Tick: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
            <path d="m9 11 3 3L22 4"></path>
        </svg>
    );
};

const Shield: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
        </svg>
    );
};

const ShieldTick: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="m9 12 2 2 4-4"></path>
        </svg>
    );
};

const Heart: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>
    );
};

const ArrowRight: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
        </svg>
    );
};

const ArrowLeft: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
        </svg>
    );
};

const Phone: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
        </svg>
    );
};

const Location: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    );
};

const Calendar: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <path d="M3 10h18"></path>
        </svg>
    );
};

const Clock: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    );
};

const Filter: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
        </svg>
    );
};

const Hash: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <line x1="4" x2="20" y1="9" y2="9"></line>
            <line x1="4" x2="20" y1="15" y2="15"></line>
            <line x1="10" x2="8" y1="3" y2="21"></line>
            <line x1="16" x2="14" y1="3" y2="21"></line>
        </svg>
    );
};

const Share: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
        </svg>
    );
};

const Upload: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="M12 3v12"></path>
            <path d="m17 8-5-5-5 5"></path>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        </svg>
    );
};

const Warning: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
        </svg>
    );
};

const Male: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <circle cx="10" cy="14" r="6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="21" y1="3" x2="14.5" y2="9.5" />
        </svg>
    );
};

const Female: FC<CustomIconProps> = ({ strokeWidth = 2 }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            width="1em"
            height="1em"
        >
            <circle cx="12" cy="9" r="6" />
            <line x1="12" y1="15" x2="12" y2="22" />
            <line x1="9" y1="19" x2="15" y2="19" />
        </svg>
    );
};

export const PawIcon: FC<IconProps> = props => (
    <Icon component={() => <Paw strokeWidth={props.strokeWidth} />} {...props} />
);
export const UserIcon: FC<IconProps> = props => (
    <Icon component={() => <User strokeWidth={props.strokeWidth} />} {...props} />
);
export const UsersIcon: FC<IconProps> = props => (
    <Icon component={() => <Users strokeWidth={props.strokeWidth} />} {...props} />
);
export const SearchIcon: FC<IconProps> = props => (
    <Icon component={() => <Search strokeWidth={props.strokeWidth} />} {...props} />
);
export const TickIcon: FC<IconProps> = props => (
    <Icon component={() => <Tick strokeWidth={props.strokeWidth} />} {...props} />
);
export const ShieldIcon: FC<IconProps> = props => (
    <Icon component={() => <Shield strokeWidth={props.strokeWidth} />} {...props} />
);
export const ShieldTickIcon: FC<IconProps> = props => (
    <Icon component={() => <ShieldTick strokeWidth={props.strokeWidth} />} {...props} />
);
export const HeartIcon: FC<IconProps> = props => (
    <Icon component={() => <Heart strokeWidth={props.strokeWidth} />} {...props} />
);
export const ArrowRightIcon: FC<IconProps> = props => (
    <Icon component={() => <ArrowRight strokeWidth={props.strokeWidth} />} {...props} />
);
export const ArrowLeftIcon: FC<IconProps> = props => (
    <Icon component={() => <ArrowLeft strokeWidth={props.strokeWidth} />} {...props} />
);
export const PhoneIcon: FC<IconProps> = props => (
    <Icon component={() => <Phone strokeWidth={props.strokeWidth} />} {...props} />
);
export const LocationIcon: FC<IconProps> = props => (
    <Icon component={() => <Location strokeWidth={props.strokeWidth} />} {...props} />
);
export const CalendarIcon: FC<IconProps> = props => (
    <Icon component={() => <Calendar strokeWidth={props.strokeWidth} />} {...props} />
);
export const ClockIcon: FC<IconProps> = props => (
    <Icon component={() => <Clock strokeWidth={props.strokeWidth} />} {...props} />
);
export const FilterIcon: FC<IconProps> = props => (
    <Icon component={() => <Filter strokeWidth={props.strokeWidth} />} {...props} />
);
export const HashIcon: FC<IconProps> = props => (
    <Icon component={() => <Hash strokeWidth={props.strokeWidth} />} {...props} />
);
export const ShareIcon: FC<IconProps> = props => (
    <Icon component={() => <Share strokeWidth={props.strokeWidth} />} {...props} />
);
export const UploadIcon: FC<IconProps> = props => (
    <Icon component={() => <Upload strokeWidth={props.strokeWidth} />} {...props} />
);
export const WarningIcon: FC<IconProps> = props => (
    <Icon component={() => <Warning strokeWidth={props.strokeWidth} />} {...props} />
);
export const MaleIcon: FC<IconProps> = props => (
    <Icon component={() => <Male strokeWidth={props.strokeWidth} />} {...props} />
);
export const FemaleIcon: FC<IconProps> = props => (
    <Icon component={() => <Female strokeWidth={props.strokeWidth} />} {...props} />
);
