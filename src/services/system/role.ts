import  {request} from 'umi'

export async function getSystemRoleList(params:ApiRequest.System.Role.SystemRoleListParams){
    return await request<ApiResp.System.Role.RoleList>('system/role/list',{
        method: 'GET',
        params:{
            ...params
        }
    })
}