import { Link, useNavigate } from 'react-router';
import { Button, Typography } from 'antd';
import { Container, Card } from '~component/common';
import { SignInForm } from '~component/auth/auth-form';
import { GoogleOAuthButton } from '~component/auth/oauth-button';
import ForgetPasswordBtn from '~component/profile/forget-password-btn';

import { Route } from '~constant/route';

export function meta() {
    return [{ title: 'Sign In' }];
}

const { Title } = Typography;

export const SignInPage = () => {
    const navigate = useNavigate();

    return (
        <Container
            maxWidth={600}
            styles={{
                wrapper: { minHeight: '100%', alignContent: 'center' },
            }}
        >
            <Card>
                <Title level={2}>Вход</Title>

                <SignInForm onSuccess={() => navigate(Route.Home)} />

                <GoogleOAuthButton style={{ marginTop: '1em' }} block />

                <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                    <div>
                        Нет аккаунта?{' '}
                        <Link to={Route.SignUp}>
                            <Button style={{ paddingInline: 0 }} variant="link" color="orange">
                                Зарегистрироваться
                            </Button>
                        </Link>
                    </div>

                    <ForgetPasswordBtn styles={{ root: { paddingInline: 0 } }} />
                </div>
            </Card>
        </Container>
    );
};

export default SignInPage;
