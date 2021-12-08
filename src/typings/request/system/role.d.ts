declare namespace ApiRequest.System.Role {
    interface SystemRoleListParams extends ApiRequest.BaseListRequest {
        roleName?:string,
        roleKey?:string,
        createdStartTime?:string,
        createdEndTime?:string,
        status?:"0" | "1",
    
    }
}