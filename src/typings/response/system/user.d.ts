
declare namespace ApiResp.System.User {

    export interface UserInterface{
        userId:string,
        deptId:string,
        userName:string,
        nickname:string,
        email:string,
        mobile:string,
        gender:string,
        avatar:string,
        status:string
        loginIp:string,
        loginDate:string
        createBy: string,
        createTime: string,
        updateBy: string,
        updateTime: string,
        remark: string,
        root:string,
        roles:ApiResp.Role.RoleInterface[]
    }

    export interface UserList extends ApiResp.ListResp {
        data: UserInterface[]
    }

 
 }