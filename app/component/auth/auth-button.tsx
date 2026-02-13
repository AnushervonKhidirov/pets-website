import type { FC } from 'react';
import type { ButtonProps } from 'antd';
import type { AuthContent } from './auth-modal';

import { useState } from 'react';

import { Button } from 'antd';
import AuthModal from './auth-modal';

type AuthButtonProps = ButtonProps & {
    contentType?: AuthContent;
};

const AuthButton: FC<AuthButtonProps> = ({ contentType = 'sign_in', ...props }) => {
    const [open, setOpen] = useState(false);
    const btnText = contentType === 'sign_in' ? 'Войти' : 'Зарегистрироваться';

    return (
        <>
            <Button {...props} onClick={setOpen.bind(null, true)}>
                {btnText}
            </Button>

            <AuthModal open={open} setOpen={setOpen} contentType={contentType} />
        </>
    );
};

export default AuthButton;
