import {
  //AlipayCircleOutlined,
  LockOutlined,
  //MobileOutlined,
  //TaobaoCircleOutlined,
  UserOutlined,
  //WeiboCircleOutlined,
} from '@ant-design/icons';
import Axios from 'axios';
import { Alert, Tabs } from 'antd';
import React, { useState } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
//import { login } from '@/services/ant-design-pro/api';
//import { getFakeCaptcha } from '@/services/ant-design-pro/login';

//import { Switch, Route } from 'react-router';
import { useHistory } from 'react-router';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState /*setUserLoginState*/] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  let history = useHistory();
  const intl = useIntl();

  //<Route exact path='/welcome' component={Welcome} />
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      var mensagem = '';
      await Axios.post('http://localhost:5000/login', {
        email: values.username,
        password: values.password,
      }).then((res) => {
        //console.log(res);
        localStorage.setItem('token', res.data.token);
      });
      const token = localStorage.getItem('token');
      await Axios.get('http://localhost:5000/isUserAuth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.data.authenticated) {
          mensagem = 'ok';
          history.push('/welcome');
        } else {
          console.log('User not Authencticated');
        }
      });
      console.log(mensagem);

      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: 'Sucess！',
      });
      if (mensagem === 'ok') {
        await fetchUserInfo();
        if (!history) return;
        //const { query } = history.location;
        //console.log(query);
        //const { redirect } = query as { redirect: string };
        //console.log(redirect);
        //message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        //history.push('/welcome');
      }
      console.log(defaultLoginSuccessMessage);
      //console.log(message);
      //setUserLoginState(message);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Failed to login！',
      });
      //message.error(defaultLoginFailureMessage);
      console.log(defaultLoginFailureMessage);
    }
  };

  const handleSubmitRegs = async (values: API.LoginParams) => {
    try {
      var mensagem = '';
      await Axios.post('http://localhost:5000/register', {
        email: values.username,
        password: values.password,
      }).then((res) => {
        console.log(res);
      });
      console.log(mensagem);

      const defaultRegisterSuccessMessage = intl.formatMessage({
        id: 'pages.register.success',
        defaultMessage: 'Sucess！',
      });
      /*if (mensagem === 'ok') {
        //await fetchUserInfo();
        if (!history) return;
        //const { query } = history.location;
        //console.log(query);
        //const { redirect } = query as { redirect: string };
        //const redirect ="/welcome "
        //console.log(redirect);
        //message.success(defaultLoginSuccessMessage);
        //await fetchUserInfo();
      }*/
      console.log(defaultRegisterSuccessMessage);
      //console.log(message);
      //setUserLoginState(message);
    } catch (error) {
      const defaultRegisterFailureMessage = intl.formatMessage({
        id: 'pages.register.failure',
        defaultMessage: 'Failed to register！',
      });
      //message.error(defaultLoginFailureMessage);
      console.log(defaultRegisterFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          //subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <FormattedMessage key="loginWith" id="pages.login.loginWith" defaultMessage="LogIn" />,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
            //console.log(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: 'LogIn',
              })}
            />
          </Tabs>
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="register"
              tab={intl.formatMessage({
                id: 'pages.register.tab',
                defaultMessage: 'Register',
              })}
            />
          </Tabs>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: 'Insert: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="Username!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: 'Password: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="Password Required！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
        {status === 'error' && loginType === 'register' && <LoginMessage content="验证码错误" />}
        {type === 'register' && (
          <>
            <LoginForm
              onFinish={async (values) => {
                await handleSubmitRegs(values as API.LoginParams);
                //console.log(values);
              }}
            >
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: 'Insert: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="Username!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: 'Password: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="Password Required！"
                      />
                    ),
                  },
                ]}
              />
            </LoginForm>
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <a
            style={{
              float: 'right',
            }}
          ></a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
