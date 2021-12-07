declare namespace ApiRequest.System.User {
    interface SystemUserListParams extends ApiRequest.BaseListRequest {
        status?:"0" | "1",
        visible?:"0" | "1"
    }
}
