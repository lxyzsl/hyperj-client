import React, {useState,useEffect} from 'react';
import { message } from 'antd';
import ProForm, {  ProFormText } from '@ant-design/pro-form';
import { BorderlessTableOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { login,captcha } from '@/services/account';
import styles from './index.less';

export interface LoginWithPasswordProps {
  // 登录完成回调
  onCompleted: (token:string) => Promise<void>;
}

const LoginWithPassword: React.FC<LoginWithPasswordProps> = (props) => {

  const {
    onCompleted: handleCompleted,
  } = props;

  useEffect(() =>{
    fetchCaptcha()
  },[])

  const [submitting, setSubmitting] = useState(false);

  const [captchaImage,setCaptchaImage] = useState("")

  const [captchaId,setCaptchaId] = useState("")

  const fetchCaptcha = async() =>{
    let result = await captcha()
    if(result.success){
      setCaptchaImage(result.imageBase64)
      setCaptchaId(result.id)
    }
  }


  const handleSubmit = async (values: ApiRequest.Account.LoginParams) => {
    setSubmitting(true);
    values.captchaId = captchaId
    try {
      console.log(values)
      // 登录
      const result = await login({ ...values });
      console.log(result)
      if (result.success) {
        if(handleCompleted){
            await handleCompleted(result.token)
        }
        return;
      }else{
        fetchCaptcha()
      }
    } catch (error: any) {
      if (error && error.data && error.data.message) {
        message.error(error.data.message);
      } else {
        message.error('登录失败，请重试！');
      }
    }
    setSubmitting(false);
  };

  return (
    <>
    <ProForm
        initialValues={{}}
        submitter={{
        searchConfig: {
            submitText: '登录',
        },
        render: (_, dom) => dom.pop(),
        submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '300px',
              borderRadius: '4px'
            },
        },
        }}
        onFinish={handleSubmit}
    >
        <>
        <ProFormText
            name="userName"
            width={300}
            fieldProps={{
                maxLength: 11,
                prefix: <UserOutlined className={styles.prefixIcon} />,
                style:{height:'40px', borderRadius: '4px'}
            }}
            placeholder="账号"
            rules={[
            {
                required: true,
                message: '请输入账号!',
            },
            ]}
        />
        <ProFormText.Password
            name="password"
            width={300}
            fieldProps={{
              prefix: <LockOutlined className={styles.prefixIcon} />,
              style:{height:'40px', borderRadius: '4px'},
              maxLength: 30
            }}
            placeholder="密码"
            rules={[
            {
                required: true,
                message: '请输入密码！',
            },
            ]}
        />
        <div className={styles.captchaCodeWrapper}>
            <ProFormText 
              name="captcha" 
              placeholder="验证码" 
              width={180}
              fieldProps={{
                prefix: <BorderlessTableOutlined className={styles.prefixIcon} />,
                style:{height:'40px', borderRadius: '4px'}
              }} 
              rules={[
                {
                    required: true,
                    message: '请输入验证码！',
                },
                ]}
            />
            <img style={{height:'40px',width:"110px"}} src={captchaImage} alt="" onClick={fetchCaptcha} />
          </div>
        </>
    </ProForm>
    </>
  );
};

export default LoginWithPassword;
