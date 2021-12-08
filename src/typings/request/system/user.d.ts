declare namespace ApiRequest.System.User {
    interface SystemUserListParams extends ApiRequest.BaseListRequest {
        status?:"0" | "1",
        userName?:string,
        nickName?:string,
        mobile?:string,
        loginStartTime?:string,
        loginEndTime?:string,

    }
}
