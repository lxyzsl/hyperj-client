import  {request} from 'umi'

export async function getSystemUserList(params:ApiRequest.System.User.SystemUserListParams){
    return await request<ApiResp.System.User.UserList>('system/user/list',{
        method: 'GET',
        params:{
            ...params
        }
    })
}

export async function setSystemStatus(userId:string,status:"0"|"1"){
    return await request<ApiResp.IBaseResp>(`system/user/${userId}/status/${status}`,{
        method: 'PATCH',
    })
}

export async function remove(userId:string){
    return await request<ApiResp.IBaseResp>(`system/user/${userId}`,{
        method: 'DELETE',
    })
}