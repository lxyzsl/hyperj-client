declare namespace ApiResp.System.Menu {

    export interface MenuMetaInterface{
        title: string,
        icon: string,
        noCache: boolean,
        link: string | null,
    }

    export interface MenuInterface{
        name: string,
        path: string,
        hidden: boolean,
        redirect?: string,
        component: string,
        alwaysShow?: boolean, //  当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
        meta:MenuMetaInterface,
        children:MenuInterface[]
    }

    
}