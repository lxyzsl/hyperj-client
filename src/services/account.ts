import { createIcon } from "@/utils/fixMenuItemIcon";
import { MenuDataItem } from "@umijs/route-utils";
import { request  } from "umi";

/**
 * 获取验证码
 */
export async function captcha(){
    return await request<ApiResp.Account.captchaResult>('captchaImage',{
        method:"GET"
    });
}

/**
 * 登录
 */
export async function login(data:ApiRequest.Account.LoginParams){
    return await request<ApiResp.Account.LoginResult>('system/auth/login',{
        method:"POST",
        data
    });
}

/**
 * 获取用户信息
 */
export async function getUserInfo(){
    return await request<ApiResp.Account.UserInfoResult>('system/auth/getUserInfo',{
        method:"GET",
    })
}

/**
 * 获取路由信息
 */
export async function getRouters(){
    const result =  await request<ApiResp.Account.RouterResult>('system/auth/getRouters',{
        method:"GET",
    })
    return getSubRouters(result.data);
    // return result 
}

export function getSubRouters(childrens:  ApiResp.Menu.MenuInterface[]): MenuDataItem[] {
    const menuslist = childrens.map((item) => {
      return {
        path: item.path,
        icon:  item.meta.icon ? createIcon(item.meta.icon):"",
        name: item.meta.title,
        children: item.children ? getSubRouters(item.children) : undefined,
        hideChildrenInMenu: item.hidden,
        hideInMenu: item.hidden,
      };
    });

    
    return menuslist;
    
  }