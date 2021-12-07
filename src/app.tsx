import type { Settings as LayoutSettings ,MenuDataItem} from "@ant-design/pro-layout";

import { PageLoading } from "@ant-design/pro-layout";
import type { RequestConfig, RunTimeLayoutConfig } from "umi";
import type { ResponseError } from 'umi-request';
import { history, Link } from "umi";
import RightContent from "@/components/RightContent";
import Footer from "@/components/Footer";
// import { currentUser as queryCurrentUser } from "./services/ant-design-pro/api";
import { BookOutlined, LinkOutlined } from "@ant-design/icons";
import URL from './constants/url'
import Storage from './constants/storage'
import { message, notification } from "antd";
import { getUserInfo ,getRouters} from "./services/account";

const isDev = process.env.NODE_ENV === "development";

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  menuData?: MenuDataItem[]
  currentUser?: ApiResp.Account.CurrentUserInterface;
  fetchUserInfo?: () => Promise<ApiResp.Account.CurrentUserInterface | undefined>;
  fetchMenuData?: () => Promise<MenuDataItem[] | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      if(!localStorage.getItem(Storage.TOKEN_KEY)){
        history.push(URL.LOGIN_URL);
        return
      }
      const currentUserStorage = localStorage.getItem(Storage.USER_INFO_KEY);
      if(currentUserStorage){
        const currentUser = JSON.parse(currentUserStorage) as ApiResp.Account.CurrentUserInterface;
          return currentUser;
      }else{
        const result = await getUserInfo()
        if(result.success){
          const currentUser: ApiResp.Account.CurrentUserInterface = {
            user:result.user,
            permissions:result.permissions,
            roles:result.roles
          };
          localStorage.setItem(Storage.USER_INFO_KEY, JSON.stringify(currentUser));
          return currentUser
        }else{
          history.push(URL.LOGIN_URL);
        }
      }
      
    } catch (error) {
      console.log(error)
      history.push(URL.LOGIN_URL);
    }
    return undefined;
  };

  // // 获取菜单
  const fetchMenuData = async () =>{
    
    const menus = await getRouters()
    console.log(menus)
    return menus;
  }
  // 如果是登录页面，不执行
  if (history.location.pathname !== URL.LOGIN_URL) {
    const currentUser = await fetchUserInfo();
    const menuData = await fetchMenuData()
  
    return {
      fetchUserInfo,
      menuData,
      currentUser,
      settings: {},
    };
  }
  return {
    menuData: [],
    fetchUserInfo,
    settings: {},
  };
}

interface InitialStateData {
  settings?: Partial<LayoutSettings>;
  currentUser?: ApiResp.Account.CurrentUserInterface;
  fetchUserInfo?: () => Promise<ApiResp.Account.CurrentUserInterface | undefined>;
  unreadMsgCount?: number; // 未读消息通知数
}

const onPageChange = (initialState: InitialStateData | undefined) => {
  const { location } = history;

  // 忽略的页面
  if(location.pathname === URL.LOGIN_URL){
    return;
  }

  if(!initialState?.currentUser){
    // 如果没有登录，重定向到 login
    history.push(URL.LOGIN_URL);
  }
  else{
    
  }
  
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.user.userName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => { onPageChange(initialState) },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    menuDataRender:(menuData)=>initialState?.menuData || menuData,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 * https://beta-pro.ant.design/docs/request-cn
 * @param error 错误 
 */
 const errorHandler = (error: ResponseError) => {
   // 业务错误，显示错误信息
  if(error.name === 'BizError'){
    message.error(error.data.msg);
    return error.data;
  }
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    // 认证错误
    if(status === 401){
     

      // TODO清空本地存储的用户登录信息
      localStorage.setItem(Storage.USER_INFO_KEY, "");
      localStorage.setItem(Storage.TOKEN_KEY, "");
      
      message.error("授权失败")
      history.push('/login');

      return
    }
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
    return {success: false}
  }

  return response


 }


export const request: RequestConfig = {
  prefix:SERVER_URL,
  errorHandler,
  requestInterceptors: [
    (url, options) => {
      //  获取用户token
      const token = localStorage.getItem(Storage.TOKEN_KEY) || '';
      return {
        url,
        options: { 
          ...options, 
          interceptors: true, 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json;charset=UTF-8',
          } 
        },
      };
    }
  ],
};



