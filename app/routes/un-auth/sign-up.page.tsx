import { Link, useNavigate } from 'react-router';
import { Button, Typography } from 'antd';
import { Container, Card } from '~component/common';
import { SignUpForm } from '~component/auth/auth-form';
import { GoogleOAuthButton } from '~component/auth/oauth-button';
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
                <Title level={2}>Регистрация</Title>

                <SignUpForm onSuccess={() => navigate(Route.Home)} />

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
