import React, {useState} from 'react';
import { message } from 'antd';
import ProForm, { ProFormText, ProFormCaptcha } from '@ant-design/pro-form';
import { MobileOutlined, BorderlessTableOutlined } from '@ant-design/icons';
// import { sendSMSCode, loginWithMobileCode } from '@/services/account';
import styles from './index.less';
import { isValidMobile } from '@/utils/utils'
// import constants from '@/constants';

export interface LoginWithMobileCodeProps {
  onCompleted: (token:string) => Promise<void>;
}

const LoginWithMobileCode: React.FC<LoginWithMobileCodeProps> = (props) => {
  const {
    onCompleted: handleCompleted,
  } = props;

  const [submitting, setSubmitting] = useState(false);

  // 
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // TODO登录
      
    } catch (error: any) {
      if (error && error.data && error.data.message) {
        message.error(error.data.message);
      } else {
        message.error('登录失败，请重试！');
      }
    }
    setSubmitting(false);
  };

  // 获取短信验证码
  const fetchSMSCode = async (mobile: string) => {
    if(!mobile){
      message.error('请填写手机号码');
      throw new Error("请填写手机号码")
    }
    if(!isValidMobile(mobile)){
      message.error('手机号码不正确');
      throw new Error("手机号码不正确")
    }

    // 获取短信验证码接口
  }

  return (

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
              width: '300px', borderRadius: '4px'
            },
        },
        }}
        onFinish={handleSubmit}
    >
        <ProFormText
            name="mobile"
            width={300}
            fieldProps={{
              maxLength: 11,
              prefix: <MobileOutlined className={styles.prefixIcon} />,
              style:{height:'40px', borderRadius: '4px'}
            }}
            placeholder="手机号码"
            rules={[
            {
                required: true,
                message: '请输入手机号码!',
            },
            ]}
        />
        <ProFormCaptcha
          width={300}
          fieldProps={{
            size: 'large',
            prefix: <BorderlessTableOutlined className={styles.prefixIcon} />,
            style:{height:'40px', borderRadius: '4px'},
            maxLength: 6
          }}
          captchaProps={{
            size: 'large',
          }}
          // 手机号的 name，onGetCaptcha 会注入这个值
          phoneName="mobile"
          name="code"
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
          ]}
          placeholder="请输入验证码"
          // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
          // throw new Error("获取验证码错误")
          onGetCaptcha={fetchSMSCode}
        />
    </ProForm>
  );
};

export default LoginWithMobileCode;
