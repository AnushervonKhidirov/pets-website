import { useMutation } from '@tanstack/react-query';
import userService from '~service/user.service';

import { Link, useNavigate } from 'react-router';
import { Button, Typography } from 'antd';
import { Container, Card } from '~component/common';
import { SignUpForm } from '~component/auth/auth-form';
import { GoogleOAuthButton } from '~component/auth/oauth-button';
import { Route } from '~constant/route';
import useUserStore from '~store/user.store';

import { light } from '~/config/ant.config';

export function meta() {
    return [{ title: 'Sign In' }];
}

const { Title } = Typography;

const getUserInfo = userService.getMe.bind(userService);

export const SignInPage = () => {
    const navigate = useNavigate();
    const { setUser } = useUserStore(state => state);

    const { mutate } = useMutation({
        mutationKey: ['get_user_info_sign_up_page'],
        mutationFn: getUserInfo,
        onSuccess: setUser,
        onSettled: () => {
            navigate(Route.Home);
        },
    });

    return (
        <Container
            color={light}
            maxWidth={600}
            styles={{
                wrapper: { minHeight: '100%', alignContent: 'center' },
            }}
        >
            <Card>
                <Title level={2}>Регистрация</Title>

                <SignUpForm onSuccess={mutate} />

                <GoogleOAuthButton style={{ marginTop: '1em' }} block />

                <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                    Уже есть аккаунт?{' '}
                    <Link to={Route.SignIn}>
                        <Button style={{ paddingInline: 0 }} variant="link" color="orange">
                            Войти
                        </Button>
                    </Link>
                </div>
            </Card>
        </Container>
    );
};

export default SignInPage;
