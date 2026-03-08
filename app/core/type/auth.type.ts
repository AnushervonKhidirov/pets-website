export type SignInDto = {
    email: string;
    password: string;
};

export type SignUpDto = {
    code: string;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
};

export type RefreshTokenDto = {
    refreshToken: string;
};

export type Token = {
    accessToken: string;
    refreshToken: string;
};
