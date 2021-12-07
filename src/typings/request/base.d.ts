declare namespace ApiRequest {
    export interface BaseListRequest{
        pageSize?:number,
        current?:number,
        orderByColumn?:string,
        isAsc?:"ASC" | "DESC"
    }
}