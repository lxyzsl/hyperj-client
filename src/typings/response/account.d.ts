declare namespace ApiResp.Account {

    export interface captchaResult extends ApiResp.IBaseResp{
        imageBase64:string,
        id:string
    }

    export interface LoginResult extends ApiResp.IBaseResp{
        token:string
    }

    export interface CurrentUserInterface{
        permissions:string[],
        roles:string[],
        user:ApiResp.System.User.UserInterface
    }

    export interface UserInfoResult extends  ApiResp.IBaseResp{
        permissions:string[],
        roles:string[],
        user:ApiResp.System.User.UserInterface
    }

    export interface RouterResult extends  ApiResp.IBaseResp{
        data: ApiResp.System.Menu.MenuInterface[]
      }

}